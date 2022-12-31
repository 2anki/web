import { getTemplateServiceUrl } from "../../../lib/backend/getTemplateServiceUrl";
import SidebarItem from "./SidebarItem";

export  function Menu() {
  const path = window.location.pathname;
 return <aside className="menu is-flex is-flex-direction-column is-justify-content-space-between">
   <ul className="menu-list">
     <SidebarItem path={path} href="/upload">
         📦 Upload
     </SidebarItem>
     <SidebarItem href="/uploads/mine" path={path}>🗂️ My uploads</SidebarItem>
     <SidebarItem path={path} href="/search">
       🔍 Search
     </SidebarItem>
     <SidebarItem path={path} href={getTemplateServiceUrl()}>👩🏼‍🎨 Templates</SidebarItem>
     <SidebarItem path={path} href="/favorites">⭐️ Favorites</SidebarItem>
     <SidebarItem path={path} href="/learn">💡️ Learn</SidebarItem>
   </ul>
   <ul className="menu-list">
     <hr />
     <SidebarItem path={path} href="/settings">⚙️ Settings</SidebarItem>
     <SidebarItem path={path} href="https://discord.gg/PSKC3uS">👾 Discord</SidebarItem>
     <SidebarItem path={path} href="https://alemayhu.notion.site/FAQ-ef01be9c9bac41689a4d749127c14301">🙋🏽‍♀️ FAQ</SidebarItem>
     <SidebarItem path={path} href="/users/logout">🔒 log out</SidebarItem>
   </ul>
 </aside>
}
