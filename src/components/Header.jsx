import { useChat } from "../context/ChatContext";
import { useTheme } from "../context/ThemeContext";

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.59-1.59a.75.75 0 00-1.06-1.061L6.166 6.166z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path
        fillRule="evenodd"
        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path
        fillRule="evenodd"
        d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClearButton({ onClear }) {
  const handleClick = () => {
    if (window.confirm("Clear all chat history? This cannot be undone.")) {
      onClear();
    }
  };

  return (
    <button
      onClick={handleClick}
      title="Clear chat"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
        text-red-500 hover:bg-red-50 dark:hover:bg-red-950
        transition-colors duration-150"
    >
      <TrashIcon />
      <span className="hidden sm:inline">Clear</span>
    </button>
  );
}

const THEME_CYCLE = ["system", "light", "dark"];

function ThemeToggle() {
  // theme = user's choice ("system"/"light"/"dark")
  // resolvedTheme = what's actually applied ("light"/"dark")
  const { theme, setTheme, resolvedTheme } = useTheme();

  const next = () => {
    const idx = THEME_CYCLE.indexOf(theme);
    setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
  };

  // Icon shows RESOLVED theme (what's actually on screen)
  const icon = resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />;

  // Label shows USER'S CHOICE (system/light/dark)
  const label =
    theme === "system" ? "System" : theme === "light" ? "Light" : "Dark";

  return (
    <button
      onClick={next}
      title={`Theme: ${label} — click to cycle`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
        text-gray-600 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-colors duration-150"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function Header() {
  const { clearChat, messages } = useChat();

  return (
    <header
      className="w-full sticky top-0 z-10
      bg-white/80 dark:bg-gray-900/80 backdrop-blur-md
      border-b border-gray-200 dark:border-gray-700
      px-4 py-3"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Title */}
        <div className="flex items-center">
          <img
            src="/guideai-logo.png"
            alt="GuideAI Logo"
            className="h-8 object-contain"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
          {messages.length > 0 && <ClearButton onClear={clearChat} />}
        </div>
      </div>
    </header>
  );
}
