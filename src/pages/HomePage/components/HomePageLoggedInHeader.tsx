import { useUserLocals } from '../../../lib/hooks/useUserLocals';

export function HomePageLoggedInHeader() {
  const { data } = useUserLocals();
  const title = data?.user?.name;
  return <h2 className="title is-2">Welcome back{title ? `, ${title}!` : ''}</h2>;
}