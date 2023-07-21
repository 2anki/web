import styled from 'styled-components';

const Background = styled.div`
  background: rgb(229, 229, 229);
  padding: 1rem;
  border-bottom: 1px solid black;
`;
export function MigrationMessage() {
  return <Background>
    ⚠️ Due to server migration you might experience some outage. Please try again later!
  </Background>
}