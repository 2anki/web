import { ReactNode } from "react";

export interface SidebarItemProps {
  path: string;
  href: string;
  children: ReactNode;
}

export default function SidebarItem({
                                      path, href, children
                                    }: SidebarItemProps) {
  return (
    <li
    >
      <a
        className={`${path === href ? "has-text-weight-bold is-active" : ""}`}
        href={href}>
        {children}
      </a>
    </li>
  );
}
