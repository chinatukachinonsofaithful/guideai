import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem("guideai_theme") || "system",
  );

  // Derive resolvedTheme directly — always in sync with theme state
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  // Apply dark class to <html> and persist whenever theme changes
  useEffect(() => {
    const root = document.documentElement;

    // Re-resolve inside effect to get fresh system value
    const resolved = theme === "system" ? getSystemTheme() : theme;

    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("guideai_theme", theme);
  }, [theme]); // <-- fires every time theme changes

  // Live OS theme listener — only active when theme === "system"
  useEffect(() => {
    const root = document.documentElement;

    // Only use system theme if theme is literally "system"
    // Otherwise trust the explicit user choice
    let resolved;
    if (theme === "light") {
      resolved = "light";
    } else if (theme === "dark") {
      resolved = "dark";
    } else {
      // theme === "system"
      resolved = getSystemTheme();
    }

    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark"); // ← this must fire for "light"
    }

    localStorage.setItem("guideai_theme", theme);
  }, [theme]);
  const setTheme = (newTheme) => {
    setThemeState(newTheme); // triggers re-render + useEffect above
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
