import styled from 'styled-components';

type Segment = {
  value: number
  info?: string
};

interface BarOptions {
  segments: Segment[]
}

const StyledLoader = styled.div`
  width: inherit;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledSegment = styled.div`
  width: 100%;
  padding-bottom: 0.75rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 0 1rem;
`;

const StyledProgress = styled.progress`
  margin: 0.25rem !important;
`;

const StyledInformation = styled.span`
  width: 100%;
  height: 1rem;

  font-size: 0.75rem;
  text-align: center;
  line-height: 1rem;
`;

function LoadingBar(options: BarOptions) {
  const { segments } = options;
  if (segments.length === 0) { return null; }

  return (
    <StyledLoader>
      {segments.map((s) => (
        <StyledSegment style={{ width: `${100 / segments.length}%` }}>
          <StyledProgress key={`loading-bar__${Math.random().toString(16).slice(2, 4)}`} className="progress is-large is-info" max={100} value={s.value} />
          <StyledInformation>{ (s.value > 0 && s.value < 100) && s.info }</StyledInformation>
        </StyledSegment>
      ))}
    </StyledLoader>
  );
}
export default LoadingBar;
