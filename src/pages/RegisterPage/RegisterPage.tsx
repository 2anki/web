import RegisterForm from '../../components/forms/RegisterForm';
import NavButtonCTA from '../../components/buttons/NavButtonCTA';
import { Container } from '../../components/styled';
import TopSection from './TopSection';
import { goToLoginPage } from './goToLoginPage';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { useSearchParams } from 'react-router-dom';

interface Props {
  setErrorMessage: ErrorHandlerType;
}

export function RegisterPage({ setErrorMessage }: Props) {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const loginUrl = redirect
    ? `/login?redirect=${encodeURIComponent(redirect)}#login`
    : '/login#login';

  return (
    <Container>
      <TopSection onClick={() => goToLoginPage(redirect)}>
        <span className="mx-2">Already have an account?</span>
        <NavButtonCTA href={loginUrl}>Login in</NavButtonCTA>
      </TopSection>
      <RegisterForm setErrorMessage={setErrorMessage} redirect={redirect} />
    </Container>
  );
}
