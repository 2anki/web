import { useEffect, useState } from "react";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import { ControlButton } from "../ControlButton";
import { GoogleIcon } from "./icons/GoogleIcon";
import { SpeakerWaveIcon } from "./icons/SpeakerWaveIcon";

interface BlockControlsProps {
  loading: boolean;
  total: number;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  onCreateNote: () => void;
}

export function BlockControls(props: BlockControlsProps) {
  const { loading, total, index, setIndex, onCreateNote } = props;
  const speak = useSpeechSynthesis();
  const goToNextBlock = () => setIndex(Math.min(index + 1, total - 1));
  const gotToPreviousBlock = () => setIndex(Math.max(index - 1, 0));

  const [loadCreatingNote, setLoadCreatingNote] = useState(false);
  const [loadNextBlock, setLoadNextBlock] = useState(false);
  const [loadPreviousBlock, setLoadPreviousBlock] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (loadCreatingNote) {
        setLoadCreatingNote(false);
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
      if (key === "ArrowLeft") {
        gotToPreviousBlock();
      } else if (key === "ArrowRight") {
        goToNextBlock();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="field has-addons">
      <ControlButton
        disabled={index === 0}
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
        disabled={index === total - 1}
        onClick={() => {
          if (!loading) {
            setLoadNextBlock(true);
            goToNextBlock();
          }
        }}
        icon="→"
      />

      <ControlButton
        loading={false}
        label="Read text"
        onClick={() => speak()}
        icon={<SpeakerWaveIcon />}
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
      <ControlButton
        loading={false}
        label="search"
        onClick={() => {
          const selection =
            window.getSelection()?.toString() || "incremental learning";
          window.open(
            `https://www.google.com/search?q=${selection}`,
            "_target"
          );
        }}
        icon={<GoogleIcon />}
      />
    </div>
  );
}
