import { Container, Main, PageContainer } from '../../components/styled';

function VerifyPage() {
  return (
    <PageContainer>
      <Container>
        <Main>
          <h1 className="title is-1">Account verification required</h1>
          <hr />
          <p className="subtitle">
            Your account has not been verified yet, please check your email inbox or
            spam folder.
            {' '}
          </p>
          <p className="subtitle">
            If you have not received the verification email, contact
            {' '}
            <a href="mailto:alexander@alemayhu.com">alexander@alemayhu.com</a>
            .
          </p>
        </Main>
      </Container>
    </PageContainer>
  );
}

export default VerifyPage;
