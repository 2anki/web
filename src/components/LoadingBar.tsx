import styled from 'styled-components';

interface BarOptions {
  value: number;
  texts: string[];
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
  const { texts, value } = options;
  if (texts.length === 0) {
    return null;
  }

  return (
    <StyledLoader>
      {texts.map((info, i) => (
        <StyledSegment
          style={{ width: `${100 / texts.length}%` }}
          key={`loading-bar__${info}`}
        >
          <StyledProgress
            className="progress is-large is-info"
            max={100}
            value={value - i * 100}
          />
          <StyledInformation
            style={{
              opacity: value > 100 * i && value < 100 * (i + 1) ? 1 : 0.25,
            }}
          >
            {info}
          </StyledInformation>
        </StyledSegment>
      ))}
    </StyledLoader>
  );
}

export default LoadingBar;
//
