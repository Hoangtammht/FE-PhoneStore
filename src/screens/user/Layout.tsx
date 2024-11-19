import { ReactNode } from 'react';
import FooterPage from "./Footer";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

function LayoutHome({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      {children}
      <FooterPage />
    </div>
  );
}

export default LayoutHome;
