import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { ErrorHandlerType } from '../../components/errors/helpers/types';
import { Container, PageContainer } from '../../components/styled';
import LoadingPage from '../Loading';
import { useLearnData } from './helpers/useLearnData';
import Wrapper from './Wrapper';

interface Props {
  setError: ErrorHandlerType;
}

function LearnPage({ setError }: Props) {
  const [parentId, setParentId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  const { children, page, error } = useLearnData(parentId);
  const location = useLocation();
  // Load parent page based on id
  useEffect(() => {
    setParentId(location.pathname.split('/').at(-1) || null);
  }, []);

  if (error) {
    setError(error.toString());
  }
  if (!parentId || !children) {
    return <LoadingPage />;
  }

  const block = children[index - 1];

  return (
    <PageContainer>
      <h1>Learn</h1>
      <Container>
        <Wrapper>
          {page && (
            <nav className="breadcrumb" aria-label="breadcrumbs">
              <ul>
                <li>
                  <a href={page.url}>{page.title}</a>
                </li>
              </ul>
            </nav>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            {block && (
              <>
                <h1 className="title">{block.id}</h1>
                <pre>{JSON.stringify(block, null, 4)}</pre>
                <hr />
              </>
            )}
            <progress id="file" value={index + 1} max={children.length} />
            <span style={{ fontSize: '11px' }}>
              {index + 1} /{children.length}
            </span>
            <button
              type="button"
              onClick={() => setIndex(Math.max(index - 1, 0))}
            >
              previous
            </button>
            <button
              type="button"
              onClick={() => setIndex(Math.min(index + 1, children.length - 1))}
            >
              Next
            </button>
          </div>
        </Wrapper>
      </Container>
    </PageContainer>
  );
}

export default LearnPage;
