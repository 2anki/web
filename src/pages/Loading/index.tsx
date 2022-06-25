import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import LoadingBar from '../../components/LoadingBar';

const StyledLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  height: 100vh;
  width: 60vw;
  margin: 0 auto;
`;

// https://usehooks-ts.com/react-hook/use-interval
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => { clearInterval(id); };
  }, [delay]);
}

export default function LoadingPage() {
  const [loading, setLoading] = useState<number>(0);

  useInterval(
    () => setLoading(loading + 1),
    100,
  );

  return (
    <StyledLoader>
      <LoadingBar segments={
        [
          {
            value: loading % 100,
            info: 'Loading',
          },
          {
            value: 0,
            info: 'Fixing magic',
          },
          {
            value: 0,
            info: 'Just a moment',
          },
        ]
        }
      />
    </StyledLoader>
  );
}
