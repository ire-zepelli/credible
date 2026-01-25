import React, { useMemo } from "react";

export default function BrokerActivityCard({
  credentials = [],
  license = null,
  transactions = [],
}) {
  const activities = useMemo(() => {
    let items = [];

    if (license) {
      items.push({
        type: "license",
        title: "License Submitted",
        date: license.created_at || null,
        status: license.is_confirmed, // true | false | null
        denyMessage: license.deny_message || null, // ✅ add deny message
      });
    }

    credentials.forEach((c) => {
      items.push({
        type: "credential",
        title: `Credential: ${c.title || "Unknown"}`,
        date: c.created_at || null,
        status: c.is_confirmed, // true | false | null
        denyMessage: c.deny_message || null,
      });
    });

    transactions.forEach((t) => {
      items.push({
        type: "transaction",
        title: `Transaction: ${t.title || "Unknown"}`,
        date: t.created_at || null,
        status: t.is_confirmed, // true | false | null
        denyMessage: t.deny_message || null,
      });
    });

    return items.sort((a, b) => {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      return timeB - timeA;
    });
  }, [credentials, license, transactions]);

  const getStatusLabel = (status, denyMessage) => {
    if (status === true)
      return { text: "Confirmed", className: "bg-green-600/30 text-green-400" };
    if (denyMessage)
      return {
        text: `Denied: ${denyMessage}`,
        className: "bg-red-600/30 text-red-400",
      };
    return { text: "Pending", className: "bg-yellow-600/30 text-yellow-400" };
  };

  return (
    <div className="flex flex-col items-start justify-start flex-1 gap-4 bg-black/40">
      <header className="flex items-center w-full h-10 px-6 pt-8 pb-4 text-white border-b border-white/20">
        <h1 className="leading-none text-white/60">ACTIVITY FEED</h1>
      </header>

      {activities.length === 0 && (
        <p className="px-6 py-6 text-white/40">No activity yet.</p>
      )}

      {activities.map((item, idx) => {
        const statusLabel = getStatusLabel(item.status, item.denyMessage);
        return (
          <div
            key={idx}
            className="flex items-center justify-between w-full px-6 py-4 text-white border-b border-white/20"
          >
            <div className="flex flex-col">
              <p className="font-medium">{item.title}</p>
              <span className="text-xs text-white/40">
                {item.date
                  ? new Date(item.date).toLocaleString()
                  : "Unknown date"}
              </span>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded ${statusLabel.className}`}
            >
              {statusLabel.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
