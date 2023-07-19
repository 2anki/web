import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import NewPassordForm from '../../components/forms/NewPasswordForm';
import { Container } from '../../components/styled';

interface Props {
  setErrorMessage: ErrorHandlerType;
}

export function NewPasswordPage({ setErrorMessage }: Props) {
  return (
    <Container>
      <NewPassordForm setErrorMessage={setErrorMessage} />
    </Container>
  );
}
