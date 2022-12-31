import styled from "styled-components";

export const ProgressContainer = styled.div`
  max-width: 720px;
`;

export const Box = styled.div.attrs({ className: "box" })`
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: scroll;
  * {
    max-height: 45vh;
  }
`;

export const LoadingBox = styled.div.attrs({
  className: "box has-background-grey-lighter"
})`
  height: 50vh;
`;
