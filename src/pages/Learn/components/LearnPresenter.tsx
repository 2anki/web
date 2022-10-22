import { PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import NotionObject from '../../../lib/interfaces/NotionObject';
import { getBasicAnkiCallbackURL } from '../helpers/getBasicAnkiCallbackURL';
import { renderContent } from '../helpers/renderContent';
import { ChildrenType } from '../types';
import BlockControls from './BlockControls';
import { ScissorsIcon } from './BlockControls/icons/ScissorsIcon';
import { PresentableLink } from './PresentableLink';
import { SelectionButton } from './SelectionButton';

interface LearnPresenterProps {
  blocks: ChildrenType;
  textSelection: string;
  index: number;
  page: NotionObject | null | undefined;
  frontSide: string | null;
  backSide: string | null;
  onExtract: () => void;
  onDeleteBlock: () => void;
  loadExtract: boolean;
  block: PartialBlockObjectResponse | null;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  isMutating: boolean;
  loading: boolean;
}

export function LearnPresenter(props: LearnPresenterProps) {
  const {
    block,
    blocks,
    textSelection,
    index,
    page,
    frontSide,
    backSide,
    onDeleteBlock,
    onExtract,
    loadExtract,
    setIndex,
    isMutating,
    loading
  } = props;
  const length = blocks?.length ?? 0;
  const isValidCard = frontSide && backSide;

  const onCreateNote = () => {
    if (isValidCard) {
      const ankiCallbackUrl = getBasicAnkiCallbackURL(frontSide, backSide);
      window.open(ankiCallbackUrl, '_blank');
    }
  };

  return (
    <>
      <progress className="is-link progress" value={index} max={length} />
      <SelectionButton
        disabled={!textSelection}
        loading={loadExtract}
        label={textSelection}
        onClick={() => onExtract()}
        icon={<ScissorsIcon />}
      />
      {block && (
        <div id="main-content" className="box">
          {frontSide && renderContent(frontSide)}
          {backSide && renderContent(backSide)}
          {block.id}
        </div>
      )}
      <BlockControls
        loading={isMutating || loading}
        onCreateNote={onCreateNote}
        onDelete={onDeleteBlock}
        index={index}
        setIndex={(next) => {
          setIndex(next);
        }}
        total={length}
      />
      <PresentableLink object={page} />
    </>
  );
}
