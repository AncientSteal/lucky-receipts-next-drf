import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { AppInitializer } from "@/components/AppInitializer";

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Check on luck",
  description: "Test project for receipts with Next.js",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ru" className={``}>
       <body>
        <AppInitializer /> 
        
        <div className="app-container">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
