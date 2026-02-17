import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

function lazyRetry(factory: () => Promise<{ default: React.ComponentType }>) {
  return lazy(() =>
    factory().catch(() => {
      const hasReloaded = sessionStorage.getItem("chunk-reload");
      if (!hasReloaded) {
        sessionStorage.setItem("chunk-reload", "1");
        window.location.reload();
        return { default: () => null } as { default: React.ComponentType };
      }
      sessionStorage.removeItem("chunk-reload");
      return factory();
    }),
  );
}

const Home = lazyRetry(() => import("./pages/Home"));
const Projects = lazyRetry(() => import("./pages/Projects"));
const About = lazyRetry(() => import("./pages/About"));
const ChatWidget = lazyRetry(() => import("./components/ChatWidget"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />

      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
