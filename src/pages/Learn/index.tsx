/* eslint-disable react/no-danger */
import { useState, useEffect } from 'react';
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
import { SourceLink } from './components/SourceLink';

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
  const { location } = window;

  const block = children ? children[index] : null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const onCreateNote = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      const ankiCallbackUrl = `anki://x-callback-url/addnote?type=basic&deck=2anki&fldFront=${frontSide}&fldBack=${backSide}&x-success=${window.location.href}`;
      window.open(ankiCallbackUrl, '_blank');
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
        <progress
          className="is-link progress"
          value={index}
          max={children.length}
        />
        {block && (
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
          loading={isMutating || loading}
          onCreateNote={onCreateNote}
          onExtract={onExtract}
          onDelete={onDeleteBlock}
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
