import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getFirebaseAuth,
  getFirebaseDb,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "../../firebase.js";
import { Bell, Check, Clock, Send, Trash2 } from "lucide-react";

const G = "#F5A623";

const inputStyle = {
  width: "100%",
  border: "1px solid rgba(255,255,255,.1)",
  borderRadius: 12,
  background: "rgba(255,255,255,.04)",
  color: "#fff",
  padding: "11px 12px",
  outline: "none",
  fontSize: 14,
};

export default function NotificationsManager() {
  const [notifications, setNotifications] = useState([]);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [campaign, setCampaign] = useState({
    title: "",
    body: "",
    linkUrl: "",
    type: "general",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const db = getFirebaseDb();

  useEffect(() => {
    if (!db) return undefined;
    const q = query(
      collection(db, "admin_notifications"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Notification stream failed:", error);
      setLoading(false);
    });
    return () => unsub();
  }, [db]);

  useEffect(() => {
    if (!db) return undefined;
    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const unsub = onSnapshot(q, (snap) => {
      setSentNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (error) => {
      console.error("Sent notification history failed:", error);
    });
    return () => unsub();
  }, [db]);

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "admin_notifications", id), { status: "read" });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, "admin_notifications", id));
    } catch (error) {
      console.error(error);
    }
  };

  const saveCampaign = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!campaign.title.trim() || !campaign.body.trim()) {
      setMessage("Title and body are required.");
      return;
    }

    setSaving(true);
    try {
      const currentUser = getFirebaseAuth()?.currentUser;
      if (!currentUser) {
        setMessage("Admin login is required before sending.");
        return;
      }
      const idToken = await currentUser.getIdToken();
      const response = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          title: campaign.title.trim(),
          body: campaign.body.trim(),
          linkUrl: campaign.linkUrl.trim() || "/",
          type: campaign.type,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Notification send failed.");
      }
      setCampaign({ title: "", body: "", linkUrl: "", type: "general" });
      setMessage(`Sent to ${data.successCount || 0}/${data.totalTokens || 0} active devices. Failed: ${data.failureCount || 0}.`);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Could not send notification campaign.");
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString();
  };

  return (
    <div style={{ color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Platform Notifications</h2>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: 14, margin: "6px 0 0" }}>
            Real-time admin alerts plus push campaign drafts.
          </p>
        </div>
        {notifications.some((n) => n.status === "unread") && (
          <button
            onClick={() => notifications.filter((n) => n.status === "unread").forEach((n) => markAsRead(n.id))}
            style={{ padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}
          >
            Mark All Read
          </button>
        )}
      </div>

      <form
        onSubmit={saveCampaign}
        style={{
          border: "1px solid rgba(245,166,35,.18)",
          borderRadius: 18,
          padding: 18,
          marginBottom: 22,
          background: "radial-gradient(circle at 0 0, rgba(245,166,35,.1), transparent 34%), rgba(255,255,255,.025)",
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Send push notification</h3>
          <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,.45)", fontSize: 13 }}>
            Sends to all active STEA devices that allowed notifications. Delivery is handled by the secure Cloud Run admin route.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          <input value={campaign.title} onChange={(e) => setCampaign((prev) => ({ ...prev, title: e.target.value }))} placeholder="Title" style={inputStyle} />
          <input value={campaign.linkUrl} onChange={(e) => setCampaign((prev) => ({ ...prev, linkUrl: e.target.value }))} placeholder="Link URL" style={inputStyle} />
          <select value={campaign.type} onChange={(e) => setCampaign((prev) => ({ ...prev, type: e.target.value }))} style={inputStyle}>
            <option value="general">General</option>
            <option value="necta">NECTA updates</option>
            <option value="post">New post / learning content</option>
            <option value="marketplace">Marketplace</option>
            <option value="announcement">Important announcement</option>
          </select>
        </div>
        <textarea value={campaign.body} onChange={(e) => setCampaign((prev) => ({ ...prev, body: e.target.value }))} placeholder="Body" rows={4} style={{ ...inputStyle, width: "100%", marginTop: 12, resize: "vertical" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
          <div style={{ color: message.includes("Could not") || message.includes("required") ? "#fecaca" : "rgba(255,255,255,.52)", fontSize: 12 }}>
            {message}
          </div>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "none",
              borderRadius: 12,
              padding: "10px 14px",
              background: `linear-gradient(135deg, ${G}, #FFD17C)`,
              color: "#111",
              fontWeight: 900,
              cursor: saving ? "wait" : "pointer",
            }}
          >
            <Send size={16} /> {saving ? "Sending..." : "Send to all"}
          </button>
        </div>
      </form>

      {sentNotifications.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 900 }}>Sent notification history</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {sentNotifications.slice(0, 5).map((item) => (
              <div key={item.id} style={{ border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: 13, background: "rgba(255,255,255,.025)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <strong style={{ fontSize: 14 }}>{item.title}</strong>
                  <span style={{ color: G, fontSize: 12, fontWeight: 800 }}>{item.type || "general"}</span>
                </div>
                <div style={{ color: "rgba(255,255,255,.52)", fontSize: 13, marginTop: 4 }}>{item.body}</div>
                <div style={{ color: "rgba(255,255,255,.34)", fontSize: 12, marginTop: 7 }}>
                  Sent {item.successCount || 0}/{item.totalTokens || 0}, failed {item.failureCount || 0} · {formatTime(item.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              background: n.status === "unread" ? "rgba(245,166,35,.03)" : "rgba(255,255,255,.02)",
              border: `1px solid ${n.status === "unread" ? "rgba(245,166,35,.2)" : "rgba(255,255,255,.05)"}`,
              borderRadius: 16,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center", minWidth: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: n.status === "unread" ? G : "rgba(255,255,255,.05)", display: "grid", placeItems: "center", color: n.status === "unread" ? "#000" : "#fff", flexShrink: 0 }}>
                <Bell size={20} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,.6)" }}>{n.message}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={12} /> {formatTime(n.createdAt)}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {n.status === "unread" && (
                <button onClick={() => markAsRead(n.id)} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(34,197,94,.1)", color: "#22c55e", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }} title="Mark as read">
                  <Check size={18} />
                </button>
              )}
              <button onClick={() => deleteNotification(n.id)} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(239,68,68,.1)", color: "#ef4444", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }} title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {!loading && notifications.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,.3)" }}>
            <div style={{ fontSize: 15 }}>All caught up. No recent notifications.</div>
          </div>
        )}
      </div>
    </div>
  );
}
