import React from "react";

export default function StatusBadge({ status }) {
  const styles = {
    paid: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400",
    pending:
      "bg-orange-500/10 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400",
    draft:
      "bg-gray-500/10 text-gray-700 dark:bg-gray-400/10 dark:text-gray-300",
  };

  const dots = {
    paid: "bg-emerald-500",
    pending: "bg-orange-500",
    draft: "bg-gray-700 dark:bg-gray-300",
  };

  const currentStatus = status.toLowerCase();

  return (
    <div
      className={`w-[104px] h-[40px] rounded-md flex items-center justify-center gap-2 font-bold text-xs capitalize ${
        styles[currentStatus] || styles.draft
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${dots[currentStatus] || dots.draft}`}
      />
      {status}
    </div>
  );
}
