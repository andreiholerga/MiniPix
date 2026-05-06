import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  // load once
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      setTheme(saved);
    } else {
      const prefersLight = window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches;

      setTheme(prefersLight ? "light" : "dark");
    }
  }, []);

  // apply globally
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className="theme-toggle"
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
    >
      {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}