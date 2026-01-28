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
          <div>⌂</div>
          <div>홈</div>
        </div>

        <div
          className="cameraFab"
          onClick={() => navigate("/?open=1")}
          role="button"
          tabIndex={0}
          aria-label="상품 촬영/업로드"
          title="상품 촬영/업로드"
        >
          📷
        </div>

        <div
          className={`navItem ${active("/profile") ? "navItemActive" : ""}`}
          onClick={() => navigate("/profile")}
          role="button"
          tabIndex={0}
        >
          <div>👤</div>
          <div>프로필</div>
        </div>
      </nav>
    </div>
  );
}

