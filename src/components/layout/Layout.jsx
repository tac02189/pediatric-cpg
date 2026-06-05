import { useEffect } from "react";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

// Scroll to top on pathname change (declarative router has no built-in
// ScrollRestoration). Ignores in-page hash query changes within a guideline.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Layout() {
  const { pathname } = useLocation();
  // The workflow page has its own fixed bottom bar; the global footer would sit
  // beneath it (hidden, unreachable). Hide it there — the workflow already shows
  // the safety disclaimer banner up top.
  const isWorkflow = !!matchPath("/guideline/:id", pathname);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isWorkflow && <Footer />}
    </div>
  );
}
