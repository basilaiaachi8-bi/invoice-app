import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 z-50 w-full h-20 lg:w-[103px] lg:h-screen bg-[#373B53] dark:bg-[#1E2139] flex lg:flex-col justify-between items-center lg:rounded-r-3xl transition-colors duration-300">
      <div className="bg-[#7C5DFA] w-20 h-20 lg:w-[103px] lg:h-[103px] rounded-r-3xl flex items-center justify-center relative overflow-hidden shrink-0">
        <div className="bg-[#9277FF] w-full h-1/2 absolute bottom-0 rounded-tl-3xl" />
        <img src="/assets/logo.svg" alt="Logo" className="z-10 w-8 h-8" />
      </div>

      <div className="flex lg:flex-col items-center">
        <button
          onClick={toggleTheme}
          type="button"
          className="p-6 cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <img src="/assets/icon-sun.svg" alt="Sun" className="w-5 h-5" />
          ) : (
            <img src="/assets/icon-moon.svg" alt="Moon" className="w-5 h-5" />
          )}
        </button>

        <div className="w-[1px] h-20 lg:w-full lg:h-[1px] bg-[#494E6E]" />

        <div className="p-6">
          <img
            src="/assets/image-avatar.jpg"
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
