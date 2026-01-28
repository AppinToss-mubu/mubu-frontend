/**
 * 외부 쇼핑 링크 열기 컴포넌트
 * - Toss 환경: Toss 브라우저 API 사용
 * - 일반 웹: window.open() 사용
 */

import { useToss } from "../hooks/useToss";

interface ExternalLinkProps {
  url: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ExternalLink = ({
  url,
  children,
  className,
  style,
}: ExternalLinkProps) => {
  const { openBrowser } = useToss();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openBrowser(url);
  };

  return (
    <a
      href={url}
      onClick={handleClick}
      className={className}
      style={{
        ...style,
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      {children}
    </a>
  );
};
