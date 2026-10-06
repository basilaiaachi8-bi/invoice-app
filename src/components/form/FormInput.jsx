import React from "react";

export default function FormInput({ label, error, register, name, ...props }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center text-xs">
        <label
          htmlFor={name}
          className={`font-medium ${
            error ? "text-[#EC5757]" : "text-[#7E88C3] dark:text-[#DFE3FA]"
          }`}
        >
          {label}
        </label>
        {error && (
          <span className="text-[#EC5757] font-bold">{error.message}</span>
        )}
      </div>

      <input
        id={name}
        {...register(name)}
        {...props}
        className={`w-full bg-white dark:bg-[#1E2139] border ${
          error
            ? "border-[#EC5757]"
            : "border-[#DFE3FA] dark:border-[#252945] focus:border-[#7C5DFA] dark:focus:border-[#7C5DFA]"
        } rounded-md px-4 py-3 text-xs font-bold text-[#0C0E16] dark:text-white outline-none transition-colors`}
      />
    </div>
  );
}
