import { PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import NotionObject from '../../../lib/interfaces/NotionObject';
import { getBasicAnkiCallbackURL } from '../helpers/getBasicAnkiCallbackURL';
import { ChildrenType } from '../types';
import BlockControls from './BlockControls';
import { DeleteIcon } from './BlockControls/icons/DeleteIcon';
import { ScissorsIcon } from './BlockControls/icons/ScissorsIcon';
import { MainContent } from './MainContent';
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
  isDeletingBlock: boolean;
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
    loading,
    isDeletingBlock
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
      <div className="field is-grouped is-justify-content-space-between	">
        <SelectionButton
          disabled={!textSelection}
          loading={loadExtract}
          label={textSelection}
          onClick={() => onExtract()}
          icon={<ScissorsIcon />}
        />
        <SelectionButton
          loading={isDeletingBlock}
          disabled={isDeletingBlock}
          label=""
          onClick={() => {
            onDeleteBlock();
          }}
          icon={<DeleteIcon />}
        />
      </div>
      <MainContent
        loading={loading}
        frontSide={frontSide}
        backSide={backSide}
        block={block}
      />
      <BlockControls
        loading={isMutating || loading}
        onCreateNote={onCreateNote}
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
