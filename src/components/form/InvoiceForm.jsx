import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useInvoices } from "../../context/InvoiceContext";
import FormInput from "./FormInput";

const itemSchema = z.object({
  name: z.string().min(1, "can't be empty"),
  quantity: z.coerce.number().min(1, "min 1"),
  price: z.coerce.number().min(0.01, "min 0.01"),
});

const invoiceSchema = z.object({
  senderAddress: z.object({
    street: z.string().min(1, "can't be empty"),
    city: z.string().min(1, "can't be empty"),
    postCode: z.string().min(1, "can't be empty"),
    country: z.string().min(1, "can't be empty"),
  }),
  clientName: z.string().min(1, "can't be empty"),
  clientEmail: z.string().email("invalid email"),
  clientAddress: z.object({
    street: z.string().min(1, "can't be empty"),
    city: z.string().min(1, "can't be empty"),
    postCode: z.string().min(1, "can't be empty"),
    country: z.string().min(1, "can't be empty"),
  }),
  createdAt: z.string().min(1, "can't be empty"),
  paymentTerms: z.coerce.number(),
  description: z.string().min(1, "can't be empty"),
  items: z.array(itemSchema).min(1, "An item must be added"),
});

export default function InvoiceForm() {
  const {
    isFormOpen,
    setIsFormOpen,
    editingInvoice,
    setEditingInvoice,
    addInvoice,
    updateInvoice,
  } = useInvoices();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      senderAddress: { street: "", city: "", postCode: "", country: "" },
      clientName: "",
      clientEmail: "",
      clientAddress: { street: "", city: "", postCode: "", country: "" },
      createdAt: new Date().toISOString().split("T")[0],
      paymentTerms: 30,
      description: "",
      items: [{ name: "", quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedCreatedAt = watch("createdAt");
  const watchedPaymentTerms = watch("paymentTerms");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFormOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormOpen]);

  useEffect(() => {
    if (editingInvoice) {
      reset(editingInvoice);
    } else {
      reset({
        senderAddress: { street: "", city: "", postCode: "", country: "" },
        clientName: "",
        clientEmail: "",
        clientAddress: { street: "", city: "", postCode: "", country: "" },
        createdAt: new Date().toISOString().split("T")[0],
        paymentTerms: 30,
        description: "",
        items: [{ name: "", quantity: 1, price: 0 }],
      });
    }
  }, [editingInvoice, reset]);

  const calculatePaymentDue = (createdAt, paymentTerms) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    date.setDate(date.getDate() + Number(paymentTerms || 30));
    return date.toISOString().split("T")[0];
  };

  const calculatedDue = calculatePaymentDue(
    watchedCreatedAt,
    watchedPaymentTerms,
  );

  const onSubmit = (data) => {
    const formattedItems = data.items.map((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      return {
        ...item,
        quantity: qty,
        price: price,
        total: qty * price,
      };
    });

    const invoiceData = {
      ...data,
      paymentTerms: Number(data.paymentTerms),
      paymentDue: calculatedDue,
      items: formattedItems,
    };

    if (editingInvoice) {
      updateInvoice({
        ...invoiceData,
        id: editingInvoice.id,
        status: editingInvoice.status,
      });
    } else {
      addInvoice(invoiceData, false);
    }
    handleClose();
  };

  const handleSaveDraft = () => {
    const data = watch();
    const formattedItems = (data.items || []).map((item) => ({
      ...item,
      quantity: Number(item.quantity) || 0,
      price: Number(item.price) || 0,
      total: (Number(item.quantity) || 0) * (Number(item.price) || 0),
    }));

    const invoiceData = {
      ...data,
      paymentTerms: Number(data.paymentTerms) || 30,
      paymentDue: calculatedDue,
      items: formattedItems,
    };

    addInvoice(invoiceData, true);
    handleClose();
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingInvoice(null);
  };

  return (
    <AnimatePresence>
      {isFormOpen && (
        <div
          className="fixed inset-0 z-40 flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Slide Animation */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-50 w-full max-w-[616px] bg-white dark:bg-[#141625] h-full overflow-y-auto p-8 md:p-14 lg:pl-32 shadow-2xl transition-colors duration-300"
          >
            <h2 className="text-2xl font-bold text-[#0C0E16] dark:text-white mb-8">
              {editingInvoice ? (
                <>
                  Edit <span className="text-[#7E88C3]">#</span>
                  {editingInvoice.id}
                </>
              ) : (
                "New Invoice"
              )}
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-[#7C5DFA]">
                  Bill From
                </span>
                <FormInput
                  label="Street Address"
                  name="senderAddress.street"
                  register={register}
                  error={errors.senderAddress?.street}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormInput
                    label="City"
                    name="senderAddress.city"
                    register={register}
                    error={errors.senderAddress?.city}
                  />
                  <FormInput
                    label="Post Code"
                    name="senderAddress.postCode"
                    register={register}
                    error={errors.senderAddress?.postCode}
                  />
                  <div className="col-span-2 md:col-span-1">
                    <FormInput
                      label="Country"
                      name="senderAddress.country"
                      register={register}
                      error={errors.senderAddress?.country}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-[#7C5DFA]">
                  Bill To
                </span>
                <FormInput
                  label="Client's Name"
                  name="clientName"
                  register={register}
                  error={errors.clientName}
                />
                <FormInput
                  label="Client's Email"
                  type="email"
                  name="clientEmail"
                  placeholder="e.g. alex@mail.com"
                  register={register}
                  error={errors.clientEmail}
                />
                <FormInput
                  label="Street Address"
                  name="clientAddress.street"
                  register={register}
                  error={errors.clientAddress?.street}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormInput
                    label="City"
                    name="clientAddress.city"
                    register={register}
                    error={errors.clientAddress?.city}
                  />
                  <FormInput
                    label="Post Code"
                    name="clientAddress.postCode"
                    register={register}
                    error={errors.clientAddress?.postCode}
                  />
                  <div className="col-span-2 md:col-span-1">
                    <FormInput
                      label="Country"
                      name="clientAddress.country"
                      register={register}
                      error={errors.clientAddress?.country}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Invoice Date"
                  type="date"
                  name="createdAt"
                  register={register}
                  error={errors.createdAt}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-[#7E88C3] dark:text-[#DFE3FA]">
                    Payment Terms
                  </label>
                  <select
                    {...register("paymentTerms")}
                    className="w-full bg-white dark:bg-[#1E2139] border border-[#DFE3FA] dark:border-[#252945] rounded-md px-4 py-3 text-xs font-bold text-[#0C0E16] dark:text-white outline-none focus:border-[#7C5DFA]"
                  >
                    <option value={1}>Net 1 Day</option>
                    <option value={7}>Net 7 Days</option>
                    <option value={14}>Net 14 Days</option>
                    <option value={30}>Net 30 Days</option>
                  </select>
                </div>
              </div>

              {calculatedDue && (
                <p className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] italic">
                  Payment Due Date:{" "}
                  <span className="font-bold">{calculatedDue}</span>
                </p>
              )}

              <FormInput
                label="Project Description"
                name="description"
                placeholder="e.g. Graphic Design Service"
                register={register}
                error={errors.description}
              />

              <div className="flex flex-col gap-4 mt-4">
                <h3 className="text-lg font-bold text-[#7C5DFA]">Item List</h3>
                {errors.items?.message && (
                  <span className="text-xs font-bold text-[#EC5757]">
                    {errors.items.message}
                  </span>
                )}

                {fields.map((field, index) => {
                  const qty = watch(`items.${index}.quantity`) || 0;
                  const price = watch(`items.${index}.price`) || 0;
                  const total = (qty * price).toFixed(2);

                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-3 items-center"
                    >
                      <div className="col-span-12 md:col-span-5">
                        <FormInput
                          label="Item Name"
                          name={`items.${index}.name`}
                          register={register}
                          error={errors.items?.[index]?.name}
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2">
                        <FormInput
                          label="Qty."
                          type="number"
                          name={`items.${index}.quantity`}
                          register={register}
                          error={errors.items?.[index]?.quantity}
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <FormInput
                          label="Price"
                          type="number"
                          step="0.01"
                          name={`items.${index}.price`}
                          register={register}
                          error={errors.items?.[index]?.price}
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2 flex flex-col gap-2">
                        <span className="text-xs font-medium text-[#7E88C3] dark:text-[#DFE3FA]">
                          Total
                        </span>
                        <span className="text-xs font-bold text-[#888EB0] dark:text-[#DFE3FA] py-3">
                          ${total}
                        </span>
                      </div>
                      <div className="col-span-2 md:col-span-1 flex justify-end items-center pt-5">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 hover:opacity-70 transition-opacity"
                        >
                          <img
                            src="/assets/icon-delete.svg"
                            alt="Delete item"
                            className="w-3 h-4"
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => append({ name: "", quantity: 1, price: 0 })}
                  className="w-full bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-white dark:hover:text-[#0C0E16] text-[#7E88C3] dark:text-[#DFE3FA] font-bold text-xs py-4 rounded-full transition-colors mt-2"
                >
                  + Add New Item
                </button>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#DFE3FA] dark:border-[#252945]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold text-xs px-6 py-4 rounded-full transition-colors"
                >
                  Discard
                </button>

                <div className="flex gap-2">
                  {!editingInvoice && (
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="bg-[#373B53] hover:bg-[#0C0E16] text-[#888EB0] dark:text-[#DFE3FA] font-bold text-xs px-6 py-4 rounded-full transition-colors"
                    >
                      Save as Draft
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-[#7C5DFA] hover:bg-[#9277FF] text-white font-bold text-xs px-6 py-4 rounded-full transition-colors"
                  >
                    {editingInvoice ? "Save Changes" : "Save & Send"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
