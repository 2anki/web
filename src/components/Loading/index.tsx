import styled from 'styled-components';

const StyledLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  height: 100vh;
  width: 60vw;
  margin: 0 auto;
`;

export default function LoadingIndicator() {
  return (
    <StyledLoader>
      <button
        aria-label="loading"
        type="button"
        className="button is-loading is-light"
      />
    </StyledLoader>
  );
}
