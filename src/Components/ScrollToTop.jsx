import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Jump to the top (instantly) whenever the route changes.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === "/login" || pathname === "/signup") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
