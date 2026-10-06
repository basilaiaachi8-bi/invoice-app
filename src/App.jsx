import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import InvoiceList from "./components/invoices/InvoiceList";
import InvoiceDetails from "./components/invoices/InvoiceDetails";
import InvoiceForm from "./components/form/InvoiceForm";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8F8FB] dark:bg-[#141625] text-[#0C0E16] dark:text-white pt-20 lg:pt-0 lg:pl-[103px] transition-colors duration-300">
      <Header />
      <main className="w-full">
        <Routes>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/invoice/:id" element={<InvoiceDetails />} />
        </Routes>
      </main>
      <InvoiceForm />
    </div>
  );
}
