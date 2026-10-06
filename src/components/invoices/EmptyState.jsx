import React from "react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-16 px-6">
      <img
        src="/assets/illustration-empty.svg"
        alt="There is nothing here"
        className="w-60 h-auto mb-10"
      />
      <h2 className="text-xl font-bold text-[#0C0E16] dark:text-white mb-3">
        There is nothing here
      </h2>
      <p className="text-xs text-[#888EB0] dark:text-[#DFE3FA] max-w-[240px] leading-relaxed">
        Create an invoice by clicking the{" "}
        <span className="font-bold">New Invoice</span> button and get started
      </p>
    </div>
  );
}
