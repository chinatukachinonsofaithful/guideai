import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";
import StudyInput from "./components/StudyInput";
import StudyResponse from "./components/StudyResponse";
import Header from "./components/Header";

function Layout() {
  return (
    <div className="app-shell flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Header />

      <main className="flex-1 min-h-0 overflow-hidden flex flex-col w-full">
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col max-w-3xl w-full mx-auto px-2 sm:px-4">
          <StudyResponse />
        </div>
      </main>
      {/* Add between </main> and the input div */}
      <div className="text-center text-[10px] text-gray-400 dark:text-gray-500 py-1">
        GuideAI —{" "}
        <a
          href="https://chinonsofaithfulchinatuka.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors duration-150 underline underline-offset-2"
        >
          Developed by Chinonso Faithful Chinatuka
        </a>
      </div>
      <div className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl w-full mx-auto">
          <StudyInput />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Layout />
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
