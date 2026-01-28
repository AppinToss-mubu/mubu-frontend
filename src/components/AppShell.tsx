import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

// Note: we keep CSS in `src/App.css` and import it globally in App.tsx.

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggle } = useTheme();

  const pathname = location.pathname;
  const active = (path: string) =>
    pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <div className="appShell">
      <header className="topBar">
        <div className="brand">MUBU</div>
        <button
          className="iconButton"
          onClick={toggle}
          aria-label={mode === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
          title={mode === "dark" ? "라이트 모드" : "다크 모드"}
          type="button"
        >
          {mode === "dark" ? "☀︎" : "☾"}
        </button>
      </header>

      <main className="main">{children}</main>

      <nav className="bottomNav" aria-label="하단 내비게이션">
        <div
          className={`navItem ${active("/") ? "navItemActive" : ""}`}
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>홈</span>
        </div>

        <div
          className="cameraFab"
          onClick={() => navigate("/?open=1")}
          role="button"
          tabIndex={0}
          aria-label="상품 촬영/업로드"
          title="상품 촬영/업로드"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>

        <div
          className={`navItem ${active("/profile") ? "navItemActive" : ""}`}
          onClick={() => navigate("/profile")}
          role="button"
          tabIndex={0}
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
          <span>프로필</span>
        </div>
      </nav>
    </div>
  );
}

