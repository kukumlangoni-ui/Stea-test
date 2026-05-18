import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  PlayCircle, 
  CheckCircle,
  Settings,
  Bell
} from "lucide-react";
import { useMobile } from "../hooks/useMobile.js";
import { useCollectionWhere } from "../hooks/useFirestore.js";
import { getFirebaseAuth } from "../firebase.js";

const G = "#F5A623";

const W = ({ children, style = {} }) => (
  <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)", ...style }}>
    {children}
  </div>
);

export default function StudentCenterPage({ goPage }) {
  const isMobile = useMobile();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (auth) {
        const unsub = auth.onAuthStateChanged(u => setUser(u));
        return () => unsub();
    }
  }, []);

  // In a real app, we'd fetch enrolled courses based on user.uid
  // For now, let's show a "Getting Started" dashboard
  const { docs: enrolledCourses, loading } = useCollectionWhere("enrollments", "studentId", "==", user?.uid || "mock");

  const stats = [
    { label: "Enrolled Courses", value: enrolledCourses.length, icon: <BookOpen size={20} color={G} /> },
    { label: "Completed", value: 0, icon: <CheckCircle size={20} color="#10b981" /> },
    { label: "Certificates", value: 0, icon: <Award size={20} color="#60a5fa" /> },
    { label: "Learning Hours", value: "0h", icon: <Clock size={20} color="#a78bfa" /> },
  ];

  if (!user) {
    return (
      <div style={{ minHeight: "80vh", display: "grid", placeItems: "center", background: "#05060a", color: "#fff" }}>
        <W style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎓</div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Welcome to Student Center</h1>
          <p style={{ color: "rgba(255,255,255,.5)", marginBottom: 32 }}>Please log in to view your courses, progress, and certificates.</p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-auth'))}
            style={{ 
                background: G, color: "#111", border: "none", padding: "14px 40px", 
                borderRadius: 16, fontWeight: 900, fontSize: 16, cursor: "pointer" 
            }}
          >
            Login as Student
          </button>
        </W>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#05060a", color: "#fff", paddingTop: 40, paddingBottom: 100 }}>
      <W>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 900, margin: 0 }}>
              Welcome back, {user.displayName?.split(" ")[0] || "Student"} 🎓
            </h1>
            <p style={{ color: "rgba(255,255,255,.4)", margin: "4px 0 0" }}>Continue your learning journey today.</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", display: "grid", placeItems: "center", color: "#fff" }}>
              <Bell size={20} />
            </button>
            <button style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", display: "grid", placeItems: "center", color: "#fff" }}>
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div 
          className="stea-stats-grid-mobile"
          style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
          gap: 16, 
          marginBottom: 48 
        }}>
          {stats.map((stat, i) => (
            <div key={i} 
              className="stea-stat-card-mobile"
              style={{ 
              background: "rgba(255,255,255,.03)", 
              borderRadius: 20, 
              padding: 20, 
              border: "1px solid rgba(255,255,255,.05)" 
            }}>
              <div className="stea-icon-box" style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,.05)", display: "grid", placeItems: "center", marginBottom: 12 }}>
                {stat.icon}
              </div>
              <div className="stea-stat-num" style={{ fontSize: 24, fontWeight: 900 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Areas */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 40 }}>
          {/* My Courses */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Enrolled Courses</h2>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {loading ? (
                [1,2].map(i => <div key={i} style={{ height: 120, background: "rgba(255,255,255,.02)", borderRadius: 20 }} />)
              ) : enrolledCourses.length > 0 ? (
                enrolledCourses.map(e => (
                   <div key={e.id} style={{ 
                     background: "rgba(255,255,255,.03)", 
                     borderRadius: 24, 
                     padding: 20, 
                     border: "1px solid rgba(255,255,255,.05)",
                     display: "flex",
                     gap: 20,
                     alignItems: "center"
                   }}>
                      <div style={{ width: 100, aspectRatio: "16/9", background: "rgba(255,255,255,.05)", borderRadius: 12, overflow: "hidden" }}>
                        <img src={e.courseImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{e.courseTitle}</h4>
                        <div style={{ marginTop: 8, height: 6, background: "rgba(255,255,255,.1)", borderRadius: 3, width: "100%" }}>
                          <div style={{ height: "100%", width: `${e.progress || 0}%`, background: G, borderRadius: 3 }} />
                        </div>
                        <div style={{ marginTop: 4, fontSize: 11, color: "rgba(255,255,255,.4)", display: "flex", justifyContent: "space-between" }}>
                          <span>{e.progress || 0}% Complete</span>
                          <span>Next: {e.nextLesson || "Intro"}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => goPage(`course-detail?id=${e.courseId}`)}
                        style={{ background: "rgba(255,255,255,.05)", border: "none", color: G, width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", cursor: "pointer" }}
                      >
                        <PlayCircle size={24} />
                      </button>
                   </div>
                ))
              ) : (
                <div style={{ padding: 48, textAlign: "center", background: "rgba(255,255,255,.02)", borderRadius: 32, border: "1px dashed rgba(255,255,255,.1)" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>📚</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>Not enrolled in any courses</h3>
                  <p style={{ color: "rgba(255,255,255,.4)", marginBottom: 24 }}>Ready to start learning? Explore our course library.</p>
                  <button 
                    onClick={() => goPage("explore/courses")}
                    style={{ background: "rgba(255,255,255,.05)", color: G, border: `1px solid ${G}30`, padding: "10px 24px", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}
                  >
                    Explore Courses
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Activity/Recommended */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24 }}>Learning Activity</h2>
            <div style={{ background: "rgba(255,255,255,.02)", borderRadius: 24, padding: 24, border: "1px solid rgba(255,255,255,.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,130,246,.1)", display: "grid", placeItems: "center" }}>
                   <TrendingUp size={20} color="#60a5fa" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>Daily Streak</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>0 Days</div>
                </div>
              </div>

               <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                 <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>
                   Start a course to track your daily learning streak and earn badges.
                 </p>
                 <button 
                   onClick={() => goPage("explore/courses")}
                   style={{ width: "100%", background: "rgba(255,255,255,.05)", color: "#fff", border: "none", padding: "12px", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}
                 >
                   Find a Course
                 </button>
               </div>
            </div>
          </div>
        </div>
      </W>
    </div>
  );
}
