import React from "react";
import { useInvoices } from "../../context/InvoiceContext";
import InvoiceFilter from "./InvoiceFilter";
import InvoiceCard from "./InvoiceCard";
import EmptyState from "./EmptyState";

export default function InvoiceList() {
  const { invoices, filter, setIsFormOpen } = useInvoices();

  const getFilterStatusText = () => {
    if (invoices.length === 0) return "No invoices";
    return filter.length > 0
      ? `There are ${invoices.length} ${filter.join(", ")} invoices`
      : `There are ${invoices.length} total invoices`;
  };

  return (
    <div className="w-full max-w-[730px] mx-auto px-6 py-8 md:py-14">
      <div className="flex items-center justify-between mb-8 md:mb-16">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0C0E16] dark:text-white tracking-tight">
            Invoices
          </h1>
          <p className="text-xs text-[#888EB0] dark:text-[#DFE3FA] mt-1">
            <span className="hidden md:inline">{getFilterStatusText()}</span>
            <span className="md:hidden">{invoices.length} invoices</span>
          </p>
        </div>

        <div className="flex items-center gap-5 md:gap-10">
          <InvoiceFilter />

          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="bg-[#7C5DFA] hover:bg-[#9277FF] text-white p-2 md:py-2 md:pl-2 md:pr-4 rounded-full flex items-center gap-2 md:gap-4 transition-colors font-bold text-xs md:text-sm cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <img
                src="/assets/icon-plus.svg"
                alt="Plus"
                className="w-2.5 h-2.5"
              />
            </div>
            <span>
              New <span className="hidden md:inline">Invoice</span>
            </span>
          </button>
        </div>
      </div>

      {invoices.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          {invoices.map((invoice, idx) => (
            <InvoiceCard key={invoice.id} invoice={invoice} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
