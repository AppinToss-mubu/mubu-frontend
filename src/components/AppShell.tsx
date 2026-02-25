import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { TDSBottomNav } from "./tds";
import { isTossEnvironment } from "../utils/env";

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggle } = useTheme();
  const isToss = isTossEnvironment();

  const pathname = location.pathname;
  const active = (path: string) =>
    pathname === path || (path !== "/" && pathname.startsWith(path));

  // 토스 스타일 아이콘 (둥근 라인, 2px stroke, 깔끔한 형태)
  const HomeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CameraIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8C3 7.45 3.45 7 4 7H7.5L9 4H15L16.5 7H20C20.55 7 21 7.45 21 8V19C21 19.55 20.55 20 20 20H4C3.45 20 3 19.55 3 19V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const ProfileIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M5 20C5 17.24 8.13 15 12 15C15.87 15 19 17.24 19 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  if (isToss) {
    // 토스 환경: SDK가 자동으로 내비게이션 바(브랜드 로고+이름)를 렌더링하므로 커스텀 header 불필요
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <main className="main">{children}</main>

        <TDSBottomNav
          items={[
            {
              id: "home",
              label: "홈",
              icon: <HomeIcon />,
              active: active("/"),
              onClick: () => navigate("/"),
            },
            {
              id: "camera",
              label: "카메라",
              icon: <CameraIcon />,
              active: false,
              onClick: () => navigate("/?open=1"),
            },
            {
              id: "profile",
              label: "프로필",
              icon: <ProfileIcon />,
              active: active("/profile"),
              onClick: () => navigate("/profile"),
            },
          ]}
        />
      </div>
    );
  }

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

