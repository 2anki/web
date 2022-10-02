/* eslint-disable react/no-danger */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import { ErrorHandlerType } from '../../components/errors/helpers/types';
import { PageContainer } from '../../components/styled';
import LoadingPage from '../Loading';
import { useRenderBlock } from './helpers/useRenderBlock';
import { useLearnData } from './helpers/useLearnData';
import BlockControls from './components/BlockControls';
import useQuery from '../../lib/hooks/useQuery';
import { Container } from '../Register/styled';

interface Props {
  setError: ErrorHandlerType;
}

const BLOCK_INDEX_QUERY_PARAM = 'index';

function LearnPage({ setError }: Props) {
  const query = useQuery();
  const history = useHistory();
  const [parentId, setParentId] = useState<string | null>(null);
  const [index, setIndex] = useState(
    Number(query.get(BLOCK_INDEX_QUERY_PARAM)) || 0
  );

  const { children, page, error } = useLearnData(parentId);
  const location = useLocation();

  const block = children ? children[index] : null;
  const { loading, backSide, frontSide } = useRenderBlock(block?.id);
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
      {page && (
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <h1 className="title">
                <a href={page.url}>{page.title}</a>
              </h1>
            </li>
          </ul>
        </nav>
      )}
      {block && (
        <Container>
          <header className="card-header">
            {frontSide && (
              <div dangerouslySetInnerHTML={{ __html: frontSide }} />
            )}
          </header>
          <div className="tile">
            {backSide && <div dangerouslySetInnerHTML={{ __html: backSide }} />}
          </div>
          <footer className="card-footer">
            <BlockControls
              loading={loading}
              index={index}
              setIndex={(next) => {
                query.set(BLOCK_INDEX_QUERY_PARAM, `${next}`);
                history.push({ search: query.toString() });
                setIndex(next);
              }}
              total={children.length}
            />
          </footer>
        </Container>
      )}
    </PageContainer>
  );
}

export default LearnPage;
