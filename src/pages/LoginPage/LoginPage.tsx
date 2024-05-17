import LoginForm from '../../components/forms/LoginForm';
import { Container } from '../../components/styled';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';

interface Props {
  setErrorMessage: ErrorHandlerType;
}

export function LoginPage({ setErrorMessage }: Props) {
  return (
    <Container>
      <LoginForm onError={setErrorMessage} />
    </Container>
  );
}
