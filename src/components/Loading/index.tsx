import styled from 'styled-components';
import styles from '../../styles/shared.module.css';

const StyledLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--text-3xl);
  height: 100vh;
  width: 60vw;
  margin: 0 auto;
`;

export default function LoadingIndicator() {
  return (
    <StyledLoader>
      <div aria-label="loading" className={styles.spinner} />
    </StyledLoader>
  );
}
