import { ReactNode } from "react";
import { PageContent, Layout, PageSidebar } from "./styled";
import { ErrorPresenter } from "../errors/ErrorPresenter";
import { ErrorType } from "../errors/helpers/types";
import { Menu } from "./SideBar/Meny";
import { canShowNavbar } from "../shared/canShowNavbar";

interface LayoutProps {
  error: ErrorType;
  children: ReactNode;
}

export function PageLayout({ error, children }: LayoutProps) {
  const hideMeny =
    !canShowNavbar(window.location.pathname) ||
    window.location.pathname === "/";

  if (hideMeny) {
    return <PageContent>{children}</PageContent>;
  }

  return (
    <Layout>
      <PageSidebar>
        <Menu />
      </PageSidebar>
      <PageContent>
        <ErrorPresenter error={error} />
        {children}
      </PageContent>
    </Layout>
  );
}
