import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { ErrorHandlerType } from '../../components/errors/helpers/types';
import { Container, PageContainer } from '../../components/styled';
import LoadingPage from '../Loading';
import { getBackSide } from './helpers/getBackSide';
import { useLearnData } from './helpers/useLearnData';
import Wrapper from './Wrapper';

interface Props {
  setError: ErrorHandlerType;
}

function LearnPage({ setError }: Props) {
  const [parentId, setParentId] = useState<string | null>(null);
  const [index, setIndex] = useState(1);

  const { children, page, error } = useLearnData(parentId);
  const location = useLocation();

  const block = children ? children[index - 1] : null;
  const { loading, backSide } = getBackSide(block?.id);
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
                {backSide && (
                  // eslint-disable-next-line react/no-danger
                  <div dangerouslySetInnerHTML={{ __html: backSide }} />
                )}
                <hr />
              </>
            )}
            <progress id="file" value={index} max={children.length} />
            <span style={{ fontSize: '11px' }}>
              {index + 1} /{children.length}
            </span>
            {loading && (
              <button type="button" className="is-loading button">
                loading
              </button>
            )}
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
