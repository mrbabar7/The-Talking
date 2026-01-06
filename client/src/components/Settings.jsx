import { useContext } from "react";
import { ThemeContext } from "../provider/ThemeProvider";

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-start justify-between py-6 px-6 settings-col-bg">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Settings
          </h1>
        </div>
      </header>

      <section className="w-full h-full overflow-y-auto flex flex-col space-y-4 py-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-app">Theme</h2>

          <div className="flex items-center gap-4">
            <div className="text-sm muted">
              {theme === "light" ? "Light" : "Dark"}
            </div>
            <button
              onClick={toggleTheme}
              aria-pressed={theme === "dark"}
              className={`relative inline-flex items-center h-6 w-14 rounded-full transition-transform focus:outline-none`}
              title="Toggle theme"
            >
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 9999,
                  transition: "background-color 200ms ease",
                  backgroundColor:
                    theme === "dark"
                      ? "var(--accent)"
                      : "rgba(99,102,241,0.12)",
                }}
              />
              <span
                style={{
                  position: "relative",
                  zIndex: 10,
                  display: "block",
                  height: 18,
                  width: 18,
                  borderRadius: 9999,
                  backgroundColor: "var(--card-bg)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
                  transform:
                    theme === "dark" ? "translateX(36px)" : "translateX(4px)",
                  transition: "transform 180ms ease",
                }}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
