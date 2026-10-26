import Link from "next/link"; 
import { HomeIcon, AskIcon, ProfileIcon } from "./Icons";

interface NavigationLinksProps {
  pathname: string;
  setIsMenuOpen: (open: boolean) => void;
}

// Общий компонент для меню, чтобы не дублировать код для мобилки и десктопа
export function NavigationLinks({ pathname, setIsMenuOpen }: NavigationLinksProps) {
  const isActive = (path: string) => pathname === path ? "active" : "";

  return (
    <>
      <Link 
        href="/" 
        className={`nav-btn ${isActive("/")} button-navigation`}
        onClick={() => setIsMenuOpen(false)}
      >
        <HomeIcon />
        Личный кабинет
      </Link>
      <Link 
        href="/rules"
        className={`nav-btn ${isActive("/rules")} button-navigation`}
        onClick={() => setIsMenuOpen(false)}
      >
        <AskIcon />
        Правила
      </Link>
      <Link 
        href="/profile"
        className={`nav-btn ${isActive("/profile")} button-navigation`}
        onClick={() => setIsMenuOpen(false)}
      >
        <ProfileIcon />
        Профиль
      </Link>
    </>
  );
}