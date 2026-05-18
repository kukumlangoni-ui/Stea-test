import { Bell, X } from "lucide-react";
import usePushNotifications from "../hooks/usePushNotifications.js";

const G = "#F5A623";
const G2 = "#FFD17C";

export default function NotificationPrompt({ user = null }) {
  const {
    dismissPrompt,
    message,
    requestPermission,
    shouldShowPrompt,
    status,
  } = usePushNotifications(user);

  if (!shouldShowPrompt && status !== "missing-config" && status !== "denied" && status !== "error") {
    return null;
  }

  const showAction = shouldShowPrompt;

  return (
    <div
      role="region"
      aria-label="STEA notification opt-in"
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 86,
        zIndex: 900,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "min(440px, 100%)",
          border: "1px solid rgba(245,166,35,.22)",
          borderRadius: 18,
          padding: 14,
          background:
            "radial-gradient(circle at 12% 0%, rgba(245,166,35,.2), transparent 34%), linear-gradient(135deg, rgba(12,13,18,.98), rgba(4,5,8,.96))",
          boxShadow: "0 18px 60px rgba(0,0,0,.45), 0 0 30px rgba(245,166,35,.08)",
          color: "#fff",
          pointerEvents: "auto",
          backdropFilter: "blur(18px)",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              color: "#111",
              background: `linear-gradient(135deg, ${G}, ${G2})`,
              boxShadow: "0 0 22px rgba(245,166,35,.22)",
              flexShrink: 0,
            }}
          >
            <Bell size={19} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, letterSpacing: 0 }}>
                Get STEA updates
              </h3>
              <button
                onClick={dismissPrompt}
                aria-label="Dismiss notification prompt"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,.08)",
                  background: "rgba(255,255,255,.05)",
                  color: "rgba(255,255,255,.72)",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <X size={15} />
              </button>
            </div>

            <p style={{ margin: "5px 0 12px", color: "rgba(255,255,255,.62)", fontSize: 13, lineHeight: 1.45 }}>
              New posts, NECTA updates, learning content, marketplace drops, and important announcements.
            </p>

            {message && (
              <div style={{ marginBottom: 12, color: status === "denied" || status === "error" ? "#fecaca" : "rgba(255,255,255,.64)", fontSize: 12 }}>
                {message}
              </div>
            )}

            {showAction && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={requestPermission}
                  disabled={status === "working"}
                  style={{
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 14px",
                    background: `linear-gradient(135deg, ${G}, ${G2})`,
                    color: "#111",
                    fontSize: 13,
                    fontWeight: 900,
                    cursor: status === "working" ? "wait" : "pointer",
                  }}
                >
                  {status === "working" ? "Enabling..." : "Allow updates"}
                </button>
                <button
                  onClick={dismissPrompt}
                  style={{
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    background: "rgba(255,255,255,.05)",
                    color: "rgba(255,255,255,.76)",
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Not now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
