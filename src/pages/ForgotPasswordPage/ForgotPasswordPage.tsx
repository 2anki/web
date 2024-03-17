import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm/ForgotPasswordForm';
import NavButtonCTA from '../../components/buttons/NavButtonCTA';
import { Container } from '../../components/styled';
import TopSection from './TopSection';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';

interface Props {
  setErrorMessage: ErrorHandlerType;
}

export function ForgotPasswordPage({ setErrorMessage }: Props) {
  const onClickRegister = () => {
    window.location.href = '/register';
  };
  return (
    <Container>
      <TopSection onClick={onClickRegister}>
        Don&apos;t have an account?
        <NavButtonCTA href="/register">Register</NavButtonCTA>
      </TopSection>
      <ForgotPasswordForm setError={setErrorMessage} />
    </Container>
  );
}
