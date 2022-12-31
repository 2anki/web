import { ReactNode } from "react";
import { PageContent, Layout, PageSidebar } from "./styled";
import { ErrorPresenter } from "../errors/ErrorPresenter";
import { ErrorType } from "../errors/helpers/types";
import { Menu } from "./SideBar/Meny";

interface LayoutProps {
  error: ErrorType;
  children: ReactNode;
}

export function PageLayout({ error, children }: LayoutProps) {
  const hideMeny = window.location.pathname === "/";
  return (
    <Layout>
      <ErrorPresenter error={error} />
      {!hideMeny && (
        <PageSidebar>
          <Menu />
        </PageSidebar>
      )}
      <PageContent>{children}</PageContent>
    </Layout>
  );
}
