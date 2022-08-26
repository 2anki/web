import { useState } from 'react';
import { useInterval } from 'usehooks-ts';
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

export default function LoadingPage() {
  const [loading, setLoading] = useState<number>(0);
  useInterval(() => setLoading(loading + 1), 50);

  return (
    <StyledLoader>
      <LoadingBar
        value={loading}
        texts={['Doing magic', 'Just a moment', 'Almost done']}
      />
    </StyledLoader>
  );
}
