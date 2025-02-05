import { MoonIcon, SunIcon } from "lucide-react";
import { buttonStyles } from "../../styles/shared";
import { ThemeToggleProps } from "../../types/header";

export const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => (
  <button
    onClick={toggleTheme}
    className={buttonStyles.variants.icon}
    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
  >
    {theme === "light" ? (
      <MoonIcon className={buttonStyles.icon.base} />
    ) : (
      <SunIcon className={buttonStyles.icon.base} />
    )}
  </button>
);
