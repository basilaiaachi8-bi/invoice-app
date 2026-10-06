import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";

export default function InvoiceCard({ invoice, index = 0 }) {
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(invoice.total || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
    >
      <Link
        to={`/invoice/${invoice.id}`}
        className="bg-white dark:bg-[#1E2139] p-6 rounded-lg shadow-sm hover:border hover:border-[#7C5DFA] transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-transparent block"
      >
        <div className="flex justify-between md:justify-start md:items-center md:gap-8">
          <span className="font-bold text-xs text-[#0C0E16] dark:text-white">
            <span className="text-[#7E88C3]">#</span>
            {invoice.id}
          </span>
          <span className="text-xs text-[#858BB2] dark:text-[#DFE3FA]">
            Due {formatDate(invoice.paymentDue)}
          </span>
          <span className="text-xs text-[#858BB2] dark:text-white hidden md:block w-32 truncate">
            {invoice.clientName}
          </span>
        </div>

        <div className="flex justify-between md:hidden items-center">
          <span className="text-xs text-[#858BB2] dark:text-[#DFE3FA]">
            {invoice.clientName}
          </span>
        </div>

        <div className="flex justify-between md:justify-end items-center md:gap-8">
          <span className="text-base font-bold text-[#0C0E16] dark:text-white">
            {formattedTotal}
          </span>

          <div className="flex items-center gap-5">
            <StatusBadge status={invoice.status} />
            <img
              src="/assets/icon-arrow-right.svg"
              alt="Arrow Right"
              className="hidden md:block w-2 h-3"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
