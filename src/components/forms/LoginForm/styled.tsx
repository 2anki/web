import styled from 'styled-components';

export const FormContainer = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

export const SubmitButton = styled.button.attrs({
  className: 'button is-link is-medium is-pulled-right',
})`
  :hover {
    border: 3px solid #b5b5b5;
  }
`;
