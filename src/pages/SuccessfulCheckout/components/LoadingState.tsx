import Confetti from 'react-confetti';
import { Container } from '../../../components/styled';

export const LoadingState = () => {
  return (
    <Container className="content">
      <div className="has-text-centered">
        <h1 className="title">Processing your payment...</h1>
        <div
          className="is-flex is-justify-content-center is-align-items-center"
          style={{ minHeight: '200px' }}
        >
          <div
            className="loader is-loading"
            style={{ width: '48px', height: '48px' }}
          />
        </div>
        <p className="subtitle">
          We're activating your subscription. This usually takes just a few
          seconds.
        </p>
        <p className="has-text-grey">
          You'll be automatically redirected once your subscription is active.
        </p>
      </div>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.05}
        recycle={false}
      />
    </Container>
  );
};
