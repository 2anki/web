import { useEffect, useState } from 'react';
import { useSpeechSynthesis } from '../../helpers/useSpeechSynthesis';
import { ControlButton } from '../ControlButton';
import { DeleteIcon } from './icons/DeleteIcon';
import { ScissorsIcon } from './icons/ScissorsIcon';
import { SearchIcon } from './icons/SearchIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';

interface BlockControlsProps {
  loading: boolean;
  total: number;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  onDelete: () => void;
  onExtract: () => void;
  onCreateNote: () => void;
}

export function BlockControls(props: BlockControlsProps) {
  const [metaPressed, setMeta] = useState(false);
  const speak = useSpeechSynthesis();
  const { loading, total, index, setIndex, onDelete, onExtract, onCreateNote } =
    props;

  const goToNextBlock = () => setIndex(Math.min(index + 1, total - 1));
  const gotToPreviousBlock = () => setIndex(Math.max(index - 1, 0));

  const [loadCreatingNote, setLoadCreatingNote] = useState(false);
  const [loadExtract, setLoadExtract] = useState(false);
  const [loadDeleteBlock, setLoadDelete] = useState(false);
  const [loadNextBlock, setLoadNextBlock] = useState(false);
  const [loadPreviousBlock, setLoadPreviousBlock] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (loadCreatingNote) {
        setLoadCreatingNote(false);
      }
      if (loadExtract) {
        setLoadExtract(false);
      }
      if (loadDeleteBlock) {
        setLoadDelete(false);
      }
      if (loadNextBlock) {
        setLoadNextBlock(false);
      }
      if (loadPreviousBlock) {
        setLoadPreviousBlock(false);
      }
    }
  }, [loading]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'ArrowLeft') {
        gotToPreviousBlock();
      } else if (key === 'ArrowRight') {
        goToNextBlock();
      } else if (key === 'Backspace' || key === 'Delete') {
        onDelete();
      } else if (key === 'Meta' || key === 'Alt') {
        setMeta(true);
      } else if (key === 'x' && metaPressed) {
        onExtract();
        setMeta(false);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'Meta') {
        setMeta(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  return (
    <div className="field has-addons">
      <ControlButton
        loading={loadPreviousBlock}
        label="Previous"
        onClick={() => {
          if (!loading) {
            setLoadPreviousBlock(true);
            gotToPreviousBlock();
          }
        }}
        icon="←"
      />
      <ControlButton
        loading={loadNextBlock}
        label="Next"
        onClick={() => {
          if (!loading) {
            setLoadNextBlock(true);
            goToNextBlock();
          }
        }}
        icon="→"
      />
      <ControlButton
        loading={loadDeleteBlock}
        label="delete"
        onClick={() => {
          if (!loading) {
            setLoadDelete(true);
            onDelete();
          }
        }}
        icon={<DeleteIcon />}
      />
      <ControlButton
        loading={false}
        label="search"
        onClick={() => speak()}
        icon={<SearchIcon />}
      />
      <ControlButton
        loading={false}
        label="Read text"
        onClick={() => speak()}
        icon={<SpeakerWaveIcon />}
      />
      <ControlButton
        loading={loadExtract}
        label="extract"
        onClick={() => {
          if (!loading) {
            setLoadExtract(true);
            onExtract();
          }
        }}
        icon={<ScissorsIcon />}
      />
      <ControlButton
        loading={loadCreatingNote}
        label="create note"
        onClick={() => {
          if (!loading) {
            setLoadCreatingNote(true);
            onCreateNote();
          }
        }}
        icon={<img alt="create flashcard" src="/icons/Anki_app_logo.png" />}
      />
    </div>
  );
}
