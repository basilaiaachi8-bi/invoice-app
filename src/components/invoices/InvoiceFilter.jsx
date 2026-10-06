import React, { useState, useRef, useEffect } from "react";
import { useInvoices } from "../../context/InvoiceContext";

export default function InvoiceFilter() {
  const { filter, setFilter } = useInvoices();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statuses = ["draft", "pending", "paid"];

  const handleCheckboxChange = (status) => {
    if (filter.includes(status)) {
      setFilter(filter.filter((s) => s !== status));
    } else {
      setFilter([...filter, status]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Dropdown Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 text-xs md:text-sm font-bold text-[#0C0E16] dark:text-white hover:opacity-80 transition-opacity cursor-pointer"
      >
        <span>
          Filter <span className="hidden md:inline">by status</span>
        </span>
        <img
          src="/assets/icon-arrow-down.svg"
          alt="Arrow Down"
          className={`w-3 h-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-10 right-0 w-48 bg-white dark:bg-[#252945] rounded-lg shadow-xl p-6 flex flex-col gap-4 z-20 border border-gray-100 dark:border-transparent">
          {statuses.map((status) => (
            <label
              key={status}
              onClick={() => handleCheckboxChange(status)}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  filter.includes(status)
                    ? "bg-[#7C5DFA] border-[#7C5DFA]"
                    : "bg-[#DFE3FA] dark:bg-[#1E2139] border-transparent group-hover:border-[#7C5DFA]"
                }`}
              >
                {filter.includes(status) && (
                  <img
                    src="/assets/icon-check.svg"
                    alt="Check"
                    className="w-2.5 h-2"
                  />
                )}
              </div>
              <span className="text-xs font-bold text-[#0C0E16] dark:text-white capitalize">
                {status}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
