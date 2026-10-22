"use client";

import { useState } from "react";
import Link from "next/link"; 
import { useUserStore } from "@/app/store/useUserStore";
import { usePathname } from "next/navigation";
import {
  ArrowIcon, HomeIcon, AskIcon,
  ProfileIcon, SignIcon, CloseIcon, BurgerIcon,
} from "./Icons";
import "./Header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const userName = user?.username || 'User';
  const userEmail = user?.email || 'email не указан';


  const isActive = (path: string) => pathname === path ? "active" : "";

  // Общий компонент для меню, чтобы не дублировать код для мобилки и десктопа
  const NavigationLinks = () => (
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

  const ProfileBlock = () => (
    <div className="header-profile">
      <SignIcon />
      <div className="profile-info">
        <div className="header-avatar"></div>
        <div className="profile-short">
          <p>{userName}</p>
          <span>{userEmail}</span>
        </div>
      </div>
    </div>
  );

  const LogoBlock = () => (
    <div className="logo-state">
      <div className="header-logo"></div>
      <Link href="/" className="header-link button-navigation">
        <ArrowIcon />
        <p>На сайт</p>
      </Link>
    </div>
  );

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
            <ProfileBlock />
            <NavigationLinks />
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
            <NavigationLinks />
          </nav>

          <ProfileBlock />
        </div>
      </div>
    </header>
  );
}
