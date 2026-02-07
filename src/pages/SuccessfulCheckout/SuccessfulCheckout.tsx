import Confetti from 'react-confetti';

import { Container } from '../../components/styled';
import { useSubscriptionStatus } from './hooks/useSubscriptionStatus';
import { LoadingState } from './components/LoadingState';
import { SuccessContent } from './components/SuccessContent';

export default function SuccessfulCheckout() {
  const { shouldShowLoading, timeoutReached } =
    useSubscriptionStatus();

  if (shouldShowLoading) {
    return <LoadingState />;
  }

  return (
    <Container className="content">
      <SuccessContent timeoutReached={timeoutReached} />

      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.05}
        recycle={false}
      />
    </Container>
  );
}
