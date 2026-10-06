import React, { createContext, useContext, useState, useEffect } from "react";
import initialData from "../data/data.json";

const InvoiceContext = createContext();

const generateInvoiceId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return `${randomLetters}${randomNumbers}`;
};

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [filter, setFilter] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = (newInvoiceData, isDraft = false) => {
    const newInvoice = {
      ...newInvoiceData,
      id: generateInvoiceId(),
      status: isDraft ? "draft" : "pending",
      total: newInvoiceData.items.reduce(
        (acc, item) => acc + (item.total || 0),
        0,
      ),
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    setIsFormOpen(false);
  };

  const updateInvoice = (updatedInvoiceData) => {
    const updatedTotal = updatedInvoiceData.items.reduce(
      (acc, item) => acc + (item.total || 0),
      0,
    );

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === updatedInvoiceData.id
          ? { ...updatedInvoiceData, total: updatedTotal }
          : inv,
      ),
    );
    setIsFormOpen(false);
    setEditingInvoice(null);
  };

  const deleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    setSelectedInvoiceId(null);
  };

  const markAsPaid = (id) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv)),
    );
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (filter.length === 0) return true;
    return filter.includes(invoice.status);
  });

  const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);

  return (
    <InvoiceContext.Provider
      value={{
        invoices: filteredInvoices,
        totalInvoicesCount: invoices.length,
        filter,
        setFilter,
        selectedInvoice,
        setSelectedInvoiceId,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
        isFormOpen,
        setIsFormOpen,
        editingInvoice,
        setEditingInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoices = () => useContext(InvoiceContext);
