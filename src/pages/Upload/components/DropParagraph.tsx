import styled from 'styled-components';

const DropParagraph = styled.div<{ hover: boolean }>`
  background: lightgray;
  border-radius: 0.9rem;
  padding: 4rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 1rem;
`;

export default DropParagraph;
