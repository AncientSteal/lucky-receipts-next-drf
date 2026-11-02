import React from "react";

interface FormLayoutProps {
  children: React.ReactNode; // Сюда попадает app/form/page.tsx
  modal: React.ReactNode;    // Сюда попадает активный маршрут из @modal
}

export default function FormLayout({ children, modal }: FormLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}