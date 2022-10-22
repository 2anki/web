/* eslint-disable react/no-danger */
import { useState, useEffect } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingPage from '../../Loading';
import { useRenderBlock } from '../hooks/useRenderBlock';
import { useLearnData } from '../hooks/useLearnData';
import useQuery from '../../../lib/hooks/useQuery';
import { createParagraphBlock } from '../helpers/createParagrapBlock';
import { useSelection } from '../hooks/useSelection';
import Backend from '../../../lib/backend';
import { LearnPresenter } from './LearnPresenter';
import { RootState } from '../../../store';
import { updateIndex } from '../state/blockControlSlice';
import { getBlock } from '../helpers/getBlock';

const backend = new Backend();

export const BLOCK_INDEX_QUERY_PARAM = 'index';

export function LearnContainer() {
  const query = useQuery();
  const history = useHistory();
  const [parentId, setParentId] = useState<string | null>(null);
  const index = useSelector((state: RootState) => state.blockControl.index);
  const dispatch = useDispatch();

  const [isMutating, setIsMutating] = useState(false);
  const [loadExtract, setLoadExtract] = useState(false);
  const [isDeletingBlock, setLoadDelete] = useState(false);
  const { children, page, error } = useLearnData(parentId, isMutating);
  const { location } = window;
  const [textSelection, setTextSelection] = useState('');

  const { loading, backSide, frontSide } = useRenderBlock(
    getBlock(children, index)?.id,
    loadExtract
  );
  const refreshCurrentBlock = () => {
    if (!children) {
      return;
    }
    query.set(BLOCK_INDEX_QUERY_PARAM, `${index}`);
    history.push({ search: query.toString() });
  };

  // Load parent page based on id
  useEffect(() => {
    localStorage.setItem('learn-mode', 'true');
    setParentId(location.pathname.split('/').at(-1) || null);
    const newIndex = Number(query.get(BLOCK_INDEX_QUERY_PARAM));
    dispatch(updateIndex(newIndex));
    return () => {
      localStorage.removeItem('learn-mode');
    };
  }, []);

  const debounceSelection = _.debounce((selection) => {
    setTextSelection(selection);
  }, 300);

  useSelection((selection) => {
    debounceSelection(selection);
  });

  const onDeleteBlock = () => {
    const id = getBlock(children, index)?.id;
    if (!id) {
      return;
    }

    setIsMutating(true);
    backend
      .deleteBlock(id)
      .then(() => {
        setLoadDelete(false);
        setIsMutating(false);
        refreshCurrentBlock();
      })
      .catch(() => {
        setIsMutating(false);
        setLoadDelete(false);
      });
  };

  const onExtract = () => {
    const parent = getBlock(children, index)?.id;
    if (textSelection && parent && !loadExtract) {
      setLoadExtract(true);
      backend
        .createBlock(parent, createParagraphBlock(textSelection))
        .then(() => {
          setTextSelection('');
          setLoadExtract(false);
          refreshCurrentBlock();
        })
        .catch(() => setLoadExtract(false));
    }
  };

  const isEmpty = children && children.length === 0;
  if (error || isEmpty) {
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
          setIndex={(v) => {
            dispatch(updateIndex(v as number));
            refreshCurrentBlock();
          }}
          page={page}
          blocks={children}
          index={index}
          frontSide={frontSide}
          backSide={backSide}
          textSelection={textSelection}
          onExtract={onExtract}
          isDeletingBlock={isDeletingBlock}
          onDeleteBlock={onDeleteBlock}
          loadExtract={loadExtract}
          block={getBlock(children, index)}
          isMutating={isMutating}
          loading={loading}
        />
      </div>
    </section>
  );
}
