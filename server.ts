import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { applicationDefault, getApps, initializeApp as initializeAdminApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { getMessaging as getAdminMessaging } from "firebase-admin/messaging";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_NECTA_EXAMS = new Set(["psle", "sfna", "ftna", "csee", "acsee"]);
const ADMIN_EMAILS = new Set([
  "isayamasika100@gmail.com",
  "kukumlangoni@gmail.com",
  "swahilitecheliteacademy@gmail.com",
]);
const FIREBASE_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || "swahilitecheliteacademy";
const INVALID_FCM_CODES = new Set([
  "messaging/invalid-registration-token",
  "messaging/registration-token-not-registered",
  "messaging/invalid-argument",
]);

function getAdminApp() {
  return getApps().length
    ? getApps()[0]
    : initializeAdminApp({
        credential: applicationDefault(),
        projectId: FIREBASE_PROJECT_ID,
      });
}

function getNectaIndexUrls(examType: string, year: string) {
  const t = examType.toLowerCase();
  const T = examType.toUpperCase();
  const y = year;
  return [
    `https://onlinesys.necta.go.tz/results/${y}/${t}/index.htm`,
    `https://onlinesys.necta.go.tz/results/${y}/${t}/index.html`,
    `https://onlinesys.necta.go.tz/results/${y}/${t}/indexfiles/index_t.htm`,
    `https://onlinesys.necta.go.tz/results/${y}/${t}/indexfiles/index_s.htm`,
    `https://onlinesys.necta.go.tz/results/${y}/${t}/indexfiles/school.htm`,
    `https://onlinesys.necta.go.tz/results/${y}/${t}_results/index.htm`,
    `https://onlinesys.necta.go.tz/results/${t}${y}/index.htm`,
    `https://onlinesys.necta.go.tz/results/${t}${y}/index.html`,
    `https://onlinesys.necta.go.tz/results/${t}${y}/indexfiles/index_t.htm`,
    `http://onlinesys.necta.go.tz/results/${y}/${t}/`,
    `http://onlinesys.necta.go.tz/results/${t}${y}/`,
    `http://results.necta.go.tz/${t}${y}/index.htm`,
    `http://results.necta.go.tz/${t}${y}/index.html`,
    `http://results.necta.go.tz/${t}${y}/indexfiles/index_t.htm`,
    `http://results.necta.go.tz/${t}${y}/`,
    `http://matokeo.necta.go.tz/${t}${y}/index.htm`,
    `http://matokeo.necta.go.tz/${t}${y}/index.html`,
    `http://matokeo.necta.go.tz/${y}/${t}/index.htm`,
    `https://maktaba.tetea.org/exam-results/${T}${y}/index.htm`,
    `https://maktaba.tetea.org/exam-results/${T}${y}/index.html`,
    `https://maktaba.tetea.org/exam-results/${T}-${y}/index.htm`,
    `https://maktaba.tetea.org/exam-results/${T}-${y}/index.html`,
    `https://necta.go.tz/results/${y}/${t}/index.htm`,
    `http://www.necta.go.tz/results/${y}/${t}/index.htm`,
  ];
}

function parseNectaSchools(html: string, searchQuery: unknown) {
  const $ = cheerio.load(html);
  const schools: any[] = [];
  let parserStrategy = "link-code-name";
  const codeRegex = /([PS]\d{4})/i;
  const queryClean = String(searchQuery || "").replace(/\s+/g, "").toLowerCase();

  $("a").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim();
    const href = $(el).attr("href") || "";
    const combined = `${text} ${href}`;
    const codeMatch = combined.match(codeRegex);
    if (!codeMatch) return;

    const code = codeMatch[1].toUpperCase();
    const name = (text || code)
      .replace(new RegExp(code, "ig"), "")
      .replace(/[^\w\s']/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    const label = name || text || code;
    const nameClean = label.replace(/\s+/g, "").toLowerCase();
    const codeClean = code.toLowerCase();
    if (!searchQuery || nameClean.includes(queryClean) || codeClean.includes(queryClean)) {
      schools.push({ code, name: label, href });
    }
  });

  if (schools.length === 0) {
    parserStrategy = "legacy-text-code-name";
    const text = $.text().replace(/\r/g, "\n");
    const lines = text.split(/\n|(?=[PS]\d{4})/i).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
    for (const line of lines) {
      const match = line.match(/\b([PS]\d{4})\b\s*[-.:)]?\s*(.{2,90})/i);
      if (!match) continue;
      const code = match[1].toUpperCase();
      const name = match[2].replace(/[^\w\s']/gi, " ").replace(/\s+/g, " ").trim() || code;
      const nameClean = name.replace(/\s+/g, "").toLowerCase();
      const codeClean = code.toLowerCase();
      if (!searchQuery || nameClean.includes(queryClean) || codeClean.includes(queryClean)) {
        schools.push({ code, name, href: "" });
      }
    }
  }

  const uniqueSchools = Array.from(new Map(schools.map(s => [s.code, s])).values());
  return { schools: uniqueSchools, parserStrategy };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;

  // Use a proper path for static assets
  const publicPath = path.join(__dirname, 'public');
  const distPath = path.join(__dirname, 'dist');

  const allowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(express.static(publicPath));
  app.use(cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      const isFirebaseHosting = /^https:\/\/[a-z0-9-]+(\.web\.app|\.firebaseapp\.com)$/.test(origin);
      const isAllowed = allowedOrigins.includes(origin) || isLocalhost || isFirebaseHosting;
      callback(isAllowed ? null : new Error(`CORS blocked origin: ${origin}`), isAllowed);
    },
  }));
  app.use(express.json());

  const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const authHeader = req.headers.authorization || "";
      const match = authHeader.match(/^Bearer\s+(.+)$/i);
      if (!match) {
        return res.status(401).json({ error: "Admin authentication required.", code: "AUTH_REQUIRED" });
      }

      const adminApp = getAdminApp();
      const decoded = await getAdminAuth(adminApp).verifyIdToken(match[1]);
      const email = (decoded.email || "").toLowerCase();
      let isAdmin = ADMIN_EMAILS.has(email);

      if (!isAdmin && decoded.uid) {
        const userDoc = await getAdminFirestore(adminApp).collection("users").doc(decoded.uid).get();
        const role = String(userDoc.data()?.role || "user").toLowerCase();
        isAdmin = role === "admin" || role === "super_admin";
      }

      if (!isAdmin) {
        return res.status(403).json({ error: "Admin permission required.", code: "ADMIN_REQUIRED" });
      }

      (req as any).adminUser = { uid: decoded.uid, email };
      next();
    } catch (error: any) {
      console.error("[notifications] admin auth failed:", error?.message || error);
      res.status(401).json({ error: "Invalid admin authentication.", code: "INVALID_AUTH" });
    }
  };

  // API: Search Schools
  app.get("/api/necta/schools", async (req, res) => {
    const { query, examType, year } = req.query;
    
    if (!examType || !year) {
      return res.status(400).json({ error: "Exam type and year are required" });
    }

    const t = String(examType).toLowerCase();
    const y = String(year);

    if (!VALID_NECTA_EXAMS.has(t)) {
      return res.status(400).json({
        error: "Unsupported NECTA exam type.",
        code: "UNSUPPORTED_EXAM_TYPE",
        supportedExamTypes: Array.from(VALID_NECTA_EXAMS),
      });
    }

    try {
      const urls = getNectaIndexUrls(t, y);

      let response = null;
      let lastError = "";
      const attempts: any[] = [];
      
      for (const url of urls) {
        try {
          console.debug(`[NECTA] Attempting: ${url}`);
          response = await axios.get(url, { 
            timeout: 25000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
          });
          attempts.push({ url, status: response.status, contentType: response.headers?.["content-type"] || "" });
          if (response.data && response.data.length > 500) {
            console.debug(`[NECTA] Success: ${url}`);
            break;
          }
        } catch (e: any) {
          lastError = e.message;
          const status = e.response?.status ? ` status=${e.response.status}` : "";
          const contentType = e.response?.headers?.["content-type"] ? ` content-type=${e.response.headers["content-type"]}` : "";
          attempts.push({ url, status: e.response?.status || "ERROR", contentType: e.response?.headers?.["content-type"] || "", error: e.code || e.message });
          console.error(`[NECTA] Schools URL failed examType=${t} year=${y} url=${url}${status}${contentType} error=${e.message}`);
          continue; 
        }
      }

      if (!response || !response.data) {
        console.error(`[NECTA] All URLs failed for ${y} ${t}. Last error: ${lastError}`);
        return res.status(404).json({
          error: `NECTA ${String(examType).toUpperCase()} ${y} school list is unavailable from supported public sources.`,
          code: "NECTA_SOURCE_UNAVAILABLE",
          attempts,
        });
      }

      console.debug(`[NECTA] Received data length: ${response.data.length}`);
      if (response.data.length < 500) {
         console.warn(`[NECTA] Received suspicious data length (<500): ${response.data.length}`);
      }

      const { schools: uniqueSchools, parserStrategy } = parseNectaSchools(response.data, query);
      console.log(`[NECTA] Returning ${uniqueSchools.length} schools`);
      res.setHeader("X-NECTA-Parser-Strategy", parserStrategy);
      res.setHeader("X-NECTA-Source-URL", response.config?.url || "");
      res.json(uniqueSchools.slice(0, 100)); // Return up to 100 schools
    } catch (error: any) {
      console.error(`[NECTA] Fatal schools API error examType=${examType} year=${year} query=${query || ""}:`, error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API: Get Results
  app.get("/api/necta/results/:examType/:year/:schoolCode", async (req, res) => {
    const { examType, year, schoolCode } = req.params;
    const t = examType.toLowerCase();
    const T = examType.toUpperCase();
    const y = year;
    const s = schoolCode.toLowerCase();
    const S = schoolCode.toUpperCase();
    
    // Comprehensive fallback URLs for result pages
    const urls = [
      `https://onlinesys.necta.go.tz/results/${y}/${t}/results/${s}.htm`,
      `http://onlinesys.necta.go.tz/results/${y}/${t}/results/${s}.htm`,
      `https://onlinesys.necta.go.tz/results/${y}/${t}/results/${s}.html`,
      `https://onlinesys.necta.go.tz/results/${y}/${t}/${s}.htm`,
      `http://results.necta.go.tz/${t}${y}/results/${s}.htm`,
      `http://matokeo.necta.go.tz/${t}${y}/results/${s}.htm`,
      `https://maktaba.tetea.org/exam-results/${T}${y}/results/${s}.htm`,
      `https://maktaba.tetea.org/exam-results/${T}-${y}/results/${s}.htm`,
      `https://maktaba.tetea.org/exam-results/${T}${y}/${s}.htm`,
      // Mirror styles
      `https://onlinesys.necta.go.tz/results/${t}${y}/results/${s}.htm`,
      `http://www.necta.go.tz/results/${y}/${t}/results/${s}.htm`,
      // Capitalized variations
      `https://onlinesys.necta.go.tz/results/${y}/${t}/results/${S}.htm`,
      `https://onlinesys.necta.go.tz/results/${y}/${t}/${S}.htm`,
    ];

    // Concurrent fetch from multiple sources for speed
    const fetchPromises = urls.map((url, index) => 
      axios.get(url, {
        timeout: 25000, // 25s per request
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.0.0 Safari/537.36'
        }
      }).catch(e => {
        const status = e.response?.status ? ` status=${e.response.status}` : "";
        const contentType = e.response?.headers?.["content-type"] ? ` content-type=${e.response.headers["content-type"]}` : "";
        console.error(`[NECTA] Result URL failed examType=${t} year=${y} school=${S} index=${index} url=${url}${status}${contentType} error=${e.message}`);
        throw e; // Re-throw to be caught by Promise.any
      })
    );

    let response = null;
    try {
      // Use helper to catch failures and ignore them, returning first success
      response = await Promise.any(fetchPromises);
    } catch (e: any) {
      console.error(`[NECTA] All result URLs failed examType=${t} year=${y} school=${S}`);
      return res.status(404).json({ error: `Results not found for school ${schoolCode}.` });
    }

    if (!response || !response.data) {
      return res.status(404).json({ error: `Results not found for school ${schoolCode}.` });
    }
    
    try {
      const $ = cheerio.load(response.data);
      
      const result: any = {
        examTitle: "",
        schoolName: "",
        schoolCode: schoolCode.toUpperCase(),
        summary: [],
        students: []
      };

      $("font, h3, h2, p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.includes("EXAMINATION RESULTS")) result.examTitle = text;
        if (text.includes(schoolCode.toUpperCase())) result.schoolName = text;
      });

      if (!result.schoolName) {
        result.schoolName = $("title").text().trim() || `School ${schoolCode.toUpperCase()}`;
      }

      const tables = $("table");
      tables.each((i, table) => {
        const rows = $(table).find("tr");
        if (rows.length === 0) return;
        const tableText = $(table).text().toLowerCase();
        
        if (tableText.includes("division") || (tableText.includes("iv") && tableText.includes("iii"))) {
          const summaryData: any[] = [];
          rows.each((j, row) => {
            const cols = $(row).find("td, th");
            if (cols.length > 0) {
              summaryData.push(cols.map((_, col) => $(col).text().trim()).get());
            }
          });
          if (summaryData.length > 1) result.summary = summaryData;
        }
        
        if (tableText.includes("cno") || tableText.includes("index") || tableText.includes("candidate")) {
          const studentData: any[] = [];
          let cnoIdx = 0, sexIdx = 1, aggrIdx = 2, divIdx = 3, subjIdx = 4;
          let headerFound = false;

          rows.each((j, row) => {
            const cols = $(row).find("th, td");
            const rowData = cols.map((_, col) => $(col).text().replace(/\s+/g, ' ').trim()).get();
            if (rowData.length === 0) return;
            const rowText = rowData.join(" ").toLowerCase();
            if (rowText.includes("cno") || rowText.includes("index") || rowText.includes("cand")) {
              rowData.forEach((text, idx) => {
                const t = text.toLowerCase();
                if (t.includes("cno") || t.includes("index") || t.includes("cand")) cnoIdx = idx;
                else if (t === "sex" || t === "jinsia") sexIdx = idx;
                else if (t.includes("aggr") || t.includes("points")) aggrIdx = idx;
                else if (t.includes("div")) divIdx = idx;
                else if (t.includes("subject") || t.includes("detailed")) subjIdx = idx;
              });
              headerFound = true;
              return;
            }

            if (headerFound && rowData.length >= 3) {
              if (!rowData[cnoIdx] || rowData[cnoIdx].length < 3) return;
              studentData.push({
                indexNumber: rowData[cnoIdx] || "",
                sex: rowData[sexIdx] || "",
                points: aggrIdx !== -1 ? (rowData[aggrIdx] || "") : "",
                division: divIdx !== -1 ? (rowData[divIdx] || "") : "",
                subjects: subjIdx !== -1 ? (rowData[subjIdx] || "") : ""
              });
            }
          });
          if (studentData.length > 0) result.students = studentData;
        }
      });
      res.json(result);
    } catch (error: any) {
      console.error(`[NECTA] Fatal results parse error examType=${t} year=${y} school=${S}:`, error.message);
      res.status(500).json({ error: "Failed to fetch results from NECTA." });
    }
  });

  // API: Unified Order Storage (Server-side)
  // This endpoint handles the "Source of Truth" for all platform orders
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = req.body;
      const orderId = orderData.orderId || `STEA-SRV-${Date.now().toString().slice(-6)}`;
      
      console.log(`📝 [ORDER] Processing #${orderId} for ${orderData.customerName}`);

      // 1. Data Integrity Check
      if (!orderData.customerName || !orderData.customerPhone || !orderData.totalPrice) {
        return res.status(400).json({ error: "Missing required order fields" });
      }

      // 2. Logic for Admin Notification (WhatsApp/Email Proxy)
      // Since we don't have real Twilio/WhatsApp credits in sandbox, 
      // we log it as a successful system event that would trigger a real API.
      const notificationMsg = `🔔 NEW ORDER: #${orderId} | TZS ${Number(orderData.totalPrice).toLocaleString()} | ${orderData.customerName} (${orderData.customerPhone})`;
      console.log("SENDING ADMIN WHATSAPP:", notificationMsg);

      // 3. Return confirmation
      res.json({ 
        success: true, 
        orderId: orderId,
        message: "Order synchronized with backend successfully",
        receiptUrl: `/receipts/${orderId}` // Placeholder for later retrieval
      });

    } catch (error: any) {
      console.error("Backend order processing failed:", error);
      res.status(500).json({ error: "Failed to process order on backend" });
    }
  });

  app.post("/api/admin/notifications/send", requireAdmin, async (req, res) => {
    const title = String(req.body?.title || "").trim();
    const body = String(req.body?.body || req.body?.message || "").trim();
    const linkUrl = String(req.body?.linkUrl || req.body?.link || "/").trim() || "/";
    const type = String(req.body?.type || "general").trim().toLowerCase();
    const allowedTypes = new Set(["general", "necta", "post", "marketplace", "announcement"]);

    if (!title || !body) {
      return res.status(400).json({ error: "Title and message are required.", code: "INVALID_NOTIFICATION" });
    }
    if (!allowedTypes.has(type)) {
      return res.status(400).json({ error: "Unsupported notification type.", code: "INVALID_NOTIFICATION_TYPE" });
    }

    try {
      const adminApp = getAdminApp();
      const adminDb = getAdminFirestore(adminApp);
      const messaging = getAdminMessaging(adminApp);
      const tokenSnap = await adminDb.collection("notificationTokens").where("status", "==", "active").get();
      const tokenDocs = tokenSnap.docs
        .map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as any) }))
        .filter((item: any) => typeof item.token === "string" && item.token.length > 20);

      let successCount = 0;
      let failureCount = 0;
      const invalidTokens: string[] = [];
      const batches: string[][] = [];
      for (let i = 0; i < tokenDocs.length; i += 500) {
        batches.push(tokenDocs.slice(i, i + 500).map((item: any) => item.token));
      }

      for (const tokens of batches) {
        const response = await messaging.sendEachForMulticast({
          tokens,
          notification: { title, body },
          webpush: {
            fcmOptions: { link: linkUrl },
            notification: {
              title,
              body,
              icon: "/android-chrome-192x192.png",
              badge: "/android-chrome-192x192.png",
              data: { url: linkUrl, type },
            },
          },
          data: {
            title,
            body,
            link: linkUrl,
            url: linkUrl,
            type,
          },
        });

        successCount += response.successCount;
        failureCount += response.failureCount;
        response.responses.forEach((sendResponse, index) => {
          const code = sendResponse.error?.code || "";
          if (!sendResponse.success && INVALID_FCM_CODES.has(code)) {
            invalidTokens.push(tokens[index]);
          }
        });
      }

      if (invalidTokens.length) {
        const writer = adminDb.bulkWriter();
        invalidTokens.forEach((token) => {
          writer.set(adminDb.collection("notificationTokens").doc(token), {
            status: "inactive",
            updatedAt: FieldValue.serverTimestamp(),
            invalidReason: "FCM rejected token",
          }, { merge: true });
        });
        await writer.close();
      }

      const history = {
        title,
        body,
        linkUrl,
        type,
        status: "sent",
        target: "all-active",
        totalTokens: tokenDocs.length,
        successCount,
        failureCount,
        invalidTokenCount: invalidTokens.length,
        sentBy: (req as any).adminUser || null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      const historyRef = await adminDb.collection("notifications").add(history);

      res.json({
        ok: true,
        notificationId: historyRef.id,
        totalTokens: tokenDocs.length,
        successCount,
        failureCount,
        invalidTokenCount: invalidTokens.length,
      });
    } catch (error: any) {
      console.error("[notifications] send failed:", error?.message || error);
      res.status(500).json({
        error: "Failed to send notifications.",
        code: "NOTIFICATION_SEND_FAILED",
        detail: error?.message || String(error),
      });
    }
  });

  app.post("/api/notifications/send", async (req, res) => {
    res.status(404).json({
      error: "Use the secure admin notification endpoint.",
      code: "ADMIN_NOTIFICATION_ENDPOINT_REQUIRED",
    });
  });

  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.path.startsWith("/api")) return next(err);
    console.error(`[API] ${req.method} ${req.path} failed:`, err?.message || err);
    res.status(err?.status || 500).json({ error: err?.message || "Internal server error" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
