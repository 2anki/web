interface ProtectedItemsProps {
  visible: boolean;
  children: React.ReactNode;
}

export function ProtectedItems({
  visible,
  children,
}: ProtectedItemsProps): JSX.Element | null {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return visible ? <>{children}</> : null;
}
