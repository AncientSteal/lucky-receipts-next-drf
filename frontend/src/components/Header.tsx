"use client";

import { useState } from "react";
import Link from "next/link"; 
import { useUserStore } from "@/app/store/useUserStore";
import { usePathname } from "next/navigation";
import {
  ArrowIcon, CloseIcon, BurgerIcon,
} from "./Icons";
import "./Header.css";
import { NavigationLinks } from "./NavigationLinks";
import { ProfileBlock } from "./ProfileBlock";

function LogoBlock() {
  return (
    <div className="logo-state">
      <div className="header-logo"></div>
      <Link href="/" className="header-link button-navigation">
        <ArrowIcon />
        <p>На сайт</p>
      </Link>
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const userName = user?.username || 'User';
  const userEmail = user?.email || 'email не указан';

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="mobile-nav-wrapper">
          <LogoBlock />
          <button
            className={`burger-toggle-btn ${isMenuOpen ? "open" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Открыть меню"
          >
            {isMenuOpen ? <CloseIcon /> : <BurgerIcon />}
          </button>

          <nav className={`header-nav-mobile ${isMenuOpen ? "visible" : ""}`} aria-label="Мобильное меню">
            <ProfileBlock userEmail={userEmail} userName={userName}/>
            <NavigationLinks pathname={pathname} setIsMenuOpen={setIsMenuOpen}/>
          </nav>

          {isMenuOpen && (
            <div
              className="menu-overlay"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </div>
        <div className="header-nav-desktop">
          <LogoBlock />
          <nav className="header-nav" aria-label="Основное меню">
            <NavigationLinks pathname={pathname} setIsMenuOpen={setIsMenuOpen}/>
          </nav>

          <ProfileBlock userEmail={userEmail} userName={userName}/>
        </div>
      </div>
    </header>
  );
}
