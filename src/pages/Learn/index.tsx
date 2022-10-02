/* eslint-disable react/no-danger */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Main, PageContainer } from '../../components/styled';
import LoadingPage from '../Loading';
import { useRenderBlock } from './helpers/useRenderBlock';
import { useLearnData } from './helpers/useLearnData';
import BlockControls from './components/BlockControls';
import useQuery from '../../lib/hooks/useQuery';
import Backend from '../../lib/backend';
import { createParagraphBlock } from './helpers/createParagrapBlock';

const BLOCK_INDEX_QUERY_PARAM = 'index';

function LearnPage() {
  const query = useQuery();
  const history = useHistory();
  const [parentId, setParentId] = useState<string | null>(null);
  const [index, setIndex] = useState(
    Number(query.get(BLOCK_INDEX_QUERY_PARAM)) || 0
  );
  const [isMutating, setIsMutating] = useState(false);

  const { children, page, error } = useLearnData(parentId, isMutating);
  const location = useLocation();

  const block = children ? children[index] : null;
  const { loading, backSide, frontSide } = useRenderBlock(block?.id);
  // Load parent page based on id
  useEffect(() => {
    setParentId(location.pathname.split('/').at(-1) || null);
  }, []);

  const backend = new Backend();
  const onDeleteBlock = () => {
    const id = block?.id;
    if (!id) {
      return;
    }

    setIsMutating(true);
    backend
      .deleteBlock(block.id)
      .then(() => {
        setIsMutating(false);
      })
      .catch(() => setIsMutating(false));
  };

  const onExtract = () => {
    const selection = window.getSelection()?.toString();
    const parent = block?.id;
    if (selection && parent && !isMutating) {
      setIsMutating(true);
      backend
        .createBlock(parent, createParagraphBlock(selection))
        .then(() => setIsMutating(false))
        .catch(() => setIsMutating(false));
    }
  };

  if (error) {
    window.location.href = '/search';
  }

  if (!parentId || !children) {
    return <LoadingPage />;
  }

  return (
    <PageContainer>
      <link rel="stylesheet" href="https://2anki.net/templates/notion.css" />
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
      <Main>
        {block && (
          <div className="box container">
            {frontSide && (
              <div dangerouslySetInnerHTML={{ __html: frontSide }} />
            )}
            <div className="tile">
              {backSide && (
                <div dangerouslySetInnerHTML={{ __html: backSide }} />
              )}
            </div>
            <BlockControls
              onExtract={onExtract}
              onDelete={onDeleteBlock}
              loading={loading || isMutating}
              index={index}
              setIndex={(next) => {
                query.set(BLOCK_INDEX_QUERY_PARAM, `${next}`);
                history.push({ search: query.toString() });
                setIndex(next);
              }}
              total={children.length}
            />
          </div>
        )}
      </Main>
    </PageContainer>
  );
}

export default LearnPage;
