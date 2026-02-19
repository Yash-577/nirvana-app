import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "1.2rem",
      }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "🌞"}
    </button>
  );
};

export default ThemeToggle;
