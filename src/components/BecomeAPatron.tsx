import { StyledNavbarItem } from "./NavigationBar/styled";

function BecomeAPatron() {
  return (
    <StyledNavbarItem
      rel="noreferrer"
      target="_blank"
      href="https://www.patreon.com/alemayhu"
    >
      <img
        alt="Become a patreon button"
        src="/become_a_patron_button.png"
        loading="lazy"
      />
    </StyledNavbarItem>
  );
}

export default BecomeAPatron;
