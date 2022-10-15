/* eslint-disable react/no-danger */
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import LoadingPage from '../Loading';
import { useRenderBlock } from './helpers/useRenderBlock';
import { useLearnData } from './helpers/useLearnData';
import BlockControls from './components/BlockControls';
import useQuery from '../../lib/hooks/useQuery';
import Backend from '../../lib/backend';
import { createParagraphBlock } from './helpers/createParagrapBlock';
import { SourceLink } from './components/SourceLink';
import { useSelection } from './helpers/useSelection';
import { ScissorsIcon } from './components/BlockControls/icons/ScissorsIcon';
import { SelectionButton } from './components/SelectionButton';

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
  const [loadExtract, setLoadExtract] = useState(false);
  const { children, page, error } = useLearnData(parentId, isMutating);
  const { location } = window;
  const [textSelection, setTextSelection] = useState('');
  const [block, setBlock] = useState<PartialBlockObjectResponse | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, backSide, frontSide } = useRenderBlock(
    block?.id,
    loadExtract
  );
  // Load parent page based on id
  useEffect(() => {
    localStorage.getItem('learn-mode');
    setParentId(location.pathname.split('/').at(-1) || null);
    return () => {
      localStorage.removeItem('learn-mode');
    };
  }, []);

  useEffect(() => {
    if (children) {
      setBlock(children[index]);
    }
  }, [children, index]);

  const debounceSelection = _.debounce((selection) => {
    setTextSelection(selection);
  }, 300);

  useSelection((selection) => {
    debounceSelection(selection);
  });

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
    const parent = block?.id;
    if (textSelection && parent && !loadExtract) {
      setLoadExtract(true);
      backend
        .createBlock(parent, createParagraphBlock(textSelection))
        .then(() => {
          setLoadExtract(false);
          setTextSelection('');
        })
        .catch(() => setLoadExtract(false));
    }
  };

  const onCreateNote = () => {
    const ankiCallbackUrl = `anki://x-callback-url/addnote?type=basic&deck=2anki&fldFront=${frontSide}&fldBack=${backSide}&x-success=${window.location.href}`;
    window.open(ankiCallbackUrl, '_blank');
  };

  if (error) {
    window.location.href = '/search';
  }

  if (!parentId || !children) {
    return <LoadingPage />;
  }

  return (
    <>
      <link rel="stylesheet" href="https://2anki.net/templates/notion.css" />
      <section className="section">
        <div className="container">
          <progress
            className="is-link progress"
            value={index}
            max={children.length}
          />
          <SelectionButton
            disabled={!textSelection}
            loading={loadExtract}
            label={<u>{textSelection}</u>}
            onClick={() => onExtract()}
            icon={<ScissorsIcon />}
          />
          {block && (
            <div id="main-content" className="box">
              {frontSide && (
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: frontSide }}
                />
              )}
              {backSide && (
                <div className="content">
                  <div dangerouslySetInnerHTML={{ __html: backSide }} />
                </div>
              )}
            </div>
          )}
          <BlockControls
            loading={isMutating || loading}
            onCreateNote={onCreateNote}
            onDelete={onDeleteBlock}
            index={index}
            setIndex={(next) => {
              query.set(BLOCK_INDEX_QUERY_PARAM, `${next}`);
              history.push({ search: query.toString() });
              setIndex(next);
            }}
            total={children.length}
          />
          <p className="subtitle">
            {page && (
              <small>
                <SourceLink link={page.url} title={page.title} />
              </small>
            )}
          </p>
        </div>
      </section>
    </>
  );
}

export default LearnPage;
