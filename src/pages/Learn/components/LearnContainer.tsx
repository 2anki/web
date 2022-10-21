/* eslint-disable react/no-danger */
import { useState, useEffect } from 'react';
import { PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import LoadingPage from '../../Loading';
import { useRenderBlock } from '../helpers/useRenderBlock';
import { useLearnData } from '../helpers/useLearnData';
import useQuery from '../../../lib/hooks/useQuery';
import { createParagraphBlock } from '../helpers/createParagrapBlock';
import { useSelection } from '../helpers/useSelection';
import Backend from '../../../lib/backend';
import { LearnPresenter } from './LearnPresenter';

const backend = new Backend();

export const BLOCK_INDEX_QUERY_PARAM = 'index';

export function LearnContainer() {
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
      query.set(BLOCK_INDEX_QUERY_PARAM, `${index}`);
      history.push({ search: query.toString() });
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
          setTextSelection('');
          setLoadExtract(false);
        })
        .catch(() => setLoadExtract(false));
    }
  };

  if (error) {
    window.location.href = '/search';
  }

  if (!parentId || !children) {
    return <LoadingPage />;
  }
  return (
    <section className="section">
      <link rel="stylesheet" href="https://2anki.net/templates/notion.css" />
      <div className="container">
        <LearnPresenter
          setIndex={setIndex}
          page={page}
          blocks={children}
          index={index}
          frontSide={frontSide}
          backSide={backSide}
          textSelection={textSelection}
          onExtract={onExtract}
          onDeleteBlock={onDeleteBlock}
          loadExtract={loadExtract}
          block={block}
          isMutating={isMutating}
          loading={loading}
        />
      </div>
    </section>
  );
}
