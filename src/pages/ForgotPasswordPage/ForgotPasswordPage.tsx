import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm/ForgotPasswordForm';
import NavButtonCTA from '../../components/buttons/NavButtonCTA';
import { Container } from '../../components/styled';
import TopSection from './TopSection';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { getVisibleText } from '../../lib/text/getVisibleText';

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
        {getVisibleText('navigation.register.question')}
        <NavButtonCTA href="/register">{getVisibleText('navigation.register')}</NavButtonCTA>
      </TopSection>
      <ForgotPasswordForm setError={setErrorMessage} />
    </Container>
  );
}
