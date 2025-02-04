import { MoonIcon, SunIcon } from "lucide-react";
import { ThemeToggleProps } from "../../types/header";

export const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => (
  <button
    onClick={toggleTheme}
    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
  >
    {theme === "light" ? (
      <MoonIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    ) : (
      <SunIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    )}
  </button>
);
