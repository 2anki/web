/* eslint-disable react/no-danger */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import LoadingPage from '../Loading';
import { useRenderBlock } from './helpers/useRenderBlock';
import { useLearnData } from './helpers/useLearnData';
import BlockControls from './components/BlockControls';
import useQuery from '../../lib/hooks/useQuery';
import Backend from '../../lib/backend';
import { createParagraphBlock } from './helpers/createParagrapBlock';
import { UploadContainer } from '../Upload/styled';
import { Main } from '../../components/styled';
import { SourceLink } from './components/BlockControls/SourceLink';

const BLOCK_INDEX_QUERY_PARAM = 'index';
const backend = new Backend();
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
    localStorage.getItem('learn-mode');
    setParentId(location.pathname.split('/').at(-1) || null);
    return () => {
      localStorage.removeItem('learn-mode');
    };
  }, []);

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
    <UploadContainer>
      <link rel="stylesheet" href="https://2anki.net/templates/notion.css" />
      <Main className="tile" id="main-content">
        {!loading && block && (
          <>
            {frontSide && (
              <div
                className="box"
                dangerouslySetInnerHTML={{ __html: frontSide }}
              />
            )}
            {backSide && (
              <div className="box">
                <div dangerouslySetInnerHTML={{ __html: backSide }} />
              </div>
            )}
          </>
        )}
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
      </Main>
      {page && (
        <small>
          <SourceLink link={page.url} title={page.title} />
        </small>
      )}
    </UploadContainer>
  );
}

export default LearnPage;
