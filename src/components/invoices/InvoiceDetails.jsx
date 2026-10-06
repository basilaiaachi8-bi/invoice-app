import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useInvoices } from "../../context/InvoiceContext";
import StatusBadge from "../ui/StatusBadge";
import DeleteModal from "../ui/DeleteModal";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    invoices,
    deleteInvoice,
    markAsPaid,
    setIsFormOpen,
    setEditingInvoice,
  } = useInvoices();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const selectedInvoice = invoices.find((inv) => inv.id === id);

  if (!selectedInvoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg font-bold text-[#0C0E16] dark:text-white">
          Invoice not found
        </p>
        <Link to="/" className="text-[#7C5DFA] font-bold text-sm underline">
          Go back to all invoices
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(selectedInvoice.total || 0);

  const handleEdit = () => {
    setEditingInvoice(selectedInvoice);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteInvoice(selectedInvoice.id);
    setIsDeleteModalOpen(false);
    navigate("/");
  };

  return (
    <div className="w-full max-w-[730px] mx-auto px-6 py-8 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-6 text-xs font-bold text-[#0C0E16] dark:text-white hover:text-[#7E88C3] transition-colors mb-8"
      >
        <img src="/assets/icon-arrow-left.svg" alt="Back" className="w-2 h-3" />
        <span>Go back</span>
      </Link>

      <div className="bg-white dark:bg-[#1E2139] p-6 rounded-lg shadow-sm flex items-center justify-between mb-6 transition-colors">
        <div className="flex items-center justify-between w-full md:w-auto md:justify-start md:gap-5">
          <span className="text-xs text-[#858BB2] dark:text-[#DFE3FA]">
            Status
          </span>
          <StatusBadge status={selectedInvoice.status} />
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] hover:bg-[#DFE3FA] dark:hover:bg-white dark:hover:text-[#0C0E16] px-6 py-3 rounded-full font-bold text-xs transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-[#EC5757] hover:bg-[#FF9797] text-white px-6 py-3 rounded-full font-bold text-xs transition-colors"
          >
            Delete
          </button>
          {selectedInvoice.status !== "paid" && (
            <button
              onClick={() => markAsPaid(selectedInvoice.id)}
              className="bg-[#7C5DFA] hover:bg-[#9277FF] text-white px-6 py-3 rounded-full font-bold text-xs transition-colors"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E2139] p-6 md:p-12 rounded-lg shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8 md:mb-12">
          <div>
            <h2 className="font-bold text-base md:text-xl text-[#0C0E16] dark:text-white">
              <span className="text-[#7E88C3]">#</span>
              {selectedInvoice.id}
            </h2>
            <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mt-1">
              {selectedInvoice.description}
            </p>
          </div>

          <div className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] md:text-right leading-relaxed">
            <p>{selectedInvoice.senderAddress?.street}</p>
            <p>{selectedInvoice.senderAddress?.city}</p>
            <p>{selectedInvoice.senderAddress?.postCode}</p>
            <p>{selectedInvoice.senderAddress?.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-3">
                Invoice Date
              </p>
              <p className="text-sm md:text-base font-bold text-[#0C0E16] dark:text-white">
                {formatDate(selectedInvoice.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-3">
                Payment Due
              </p>
              <p className="text-sm md:text-base font-bold text-[#0C0E16] dark:text-white">
                {formatDate(selectedInvoice.paymentDue)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-3">
              Bill To
            </p>
            <p className="text-sm md:text-base font-bold text-[#0C0E16] dark:text-white mb-2">
              {selectedInvoice.clientName}
            </p>
            <div className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] leading-relaxed">
              <p>{selectedInvoice.clientAddress?.street}</p>
              <p>{selectedInvoice.clientAddress?.city}</p>
              <p>{selectedInvoice.clientAddress?.postCode}</p>
              <p>{selectedInvoice.clientAddress?.country}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-3">
              Sent to
            </p>
            <p className="text-sm md:text-base font-bold text-[#0C0E16] dark:text-white break-all">
              {selectedInvoice.clientEmail}
            </p>
          </div>
        </div>

        <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-t-lg p-6 md:p-8">
          <div className="hidden md:grid grid-cols-4 text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-8">
            <span>Item Name</span>
            <span className="text-center">QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>

          <div className="flex flex-col gap-6">
            {selectedInvoice.items?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center md:grid md:grid-cols-4"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-xs md:text-sm text-[#0C0E16] dark:text-white">
                    {item.name}
                  </span>
                  <span className="text-xs font-bold text-[#7E88C3] dark:text-[#888EB0] md:hidden mt-2">
                    {item.quantity} x ${item.price?.toFixed(2)}
                  </span>
                </div>

                <span className="hidden md:block text-center text-xs font-bold text-[#7E88C3] dark:text-[#DFE3FA]">
                  {item.quantity}
                </span>
                <span className="hidden md:block text-right text-xs font-bold text-[#7E88C3] dark:text-[#DFE3FA]">
                  ${item.price?.toFixed(2)}
                </span>
                <span className="font-bold text-xs md:text-sm text-[#0C0E16] dark:text-white text-right">
                  ${item.total?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#373B53] dark:bg-[#0C0E16] p-6 md:p-8 rounded-b-lg flex items-center justify-between text-white">
          <span className="text-xs">Amount Due</span>
          <span className="text-xl md:text-2xl font-bold">
            {formattedTotal}
          </span>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        invoiceId={selectedInvoice.id}
      />
    </div>
  );
}
