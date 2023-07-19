import RegisterForm from '../../components/forms/RegisterForm';
import NavButtonCTA from '../../components/buttons/NavButtonCTA';
import { Container } from '../../components/styled';
import TopSection from './TopSection';
import { goToLoginPage } from './goToLoginPage';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';

interface Props {
  setErrorMessage: ErrorHandlerType;
}

export function RegisterPage({ setErrorMessage }: Props) {
  return (
    <Container>
      <TopSection onClick={goToLoginPage}>
        <span className="mx-2">Already have an account?</span>
        <NavButtonCTA href="/login#login">Sign in</NavButtonCTA>
      </TopSection>
      <RegisterForm setErrorMessage={setErrorMessage} />
    </Container>
  );
}
