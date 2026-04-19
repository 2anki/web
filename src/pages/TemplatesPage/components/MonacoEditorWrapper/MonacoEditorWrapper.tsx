import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { AnkiNoteType, PreviewData } from "../../types/AnkiNoteType";
import TemplateApiService from "../../services/TemplateApiService";
import { validateTemplate, validateCss } from "../../lib/validateTemplate";
import styles from "./MonacoEditorWrapper.module.css";

interface MonacoEditorWrapperProps {
  noteType: AnkiNoteType;
  selectedCardIndex: number;
  selectedTemplate: "qfmt" | "afmt" | "css";
  previewData: PreviewData;
  defaultCss: string;
  onNoteTypeChange: (noteType: AnkiNoteType) => void;
  onPreviewDataChange: (previewData: PreviewData) => void;
}

const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({
  noteType,
  selectedCardIndex,
  selectedTemplate,
  previewData,
  defaultCss,
  onNoteTypeChange,
  onPreviewDataChange,
}) => {
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(340);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const previewPaneRef = useRef<HTMLDivElement>(null);
  const apiService = TemplateApiService.getInstance();

  const getCurrentContent = useCallback(() => {
    const cardType = noteType.tmpls[selectedCardIndex];
    if (!cardType) return "";

    switch (selectedTemplate) {
      case "qfmt":
        return cardType.qfmt;
      case "afmt":
        return cardType.afmt;
      case "css":
        return noteType.css;
      default:
        return "";
    }
  }, [noteType, selectedCardIndex, selectedTemplate]);

  const getLanguage = useCallback(() => {
    return selectedTemplate === "css" ? "css" : "html";
  }, [selectedTemplate]);

  const updateContent = useCallback(
    (value: string) => {
      const updatedNoteType = { ...noteType };

      if (selectedTemplate === "css") {
        updatedNoteType.css = value;
      } else {
        const cardType = { ...updatedNoteType.tmpls[selectedCardIndex] };
        if (selectedTemplate === "qfmt") {
          cardType.qfmt = value;
        } else if (selectedTemplate === "afmt") {
          cardType.afmt = value;
        }
        updatedNoteType.tmpls[selectedCardIndex] = cardType;
      }

      onNoteTypeChange(updatedNoteType);
    },
    [noteType, selectedCardIndex, selectedTemplate, onNoteTypeChange]
  );

  const validationErrors = useMemo(() => {
    if (selectedTemplate === "css") return validateCss(getCurrentContent());
    const fieldNames = noteType.flds.map((f) => f.name);
    return validateTemplate(getCurrentContent(), fieldNames);
  }, [noteType, selectedCardIndex, selectedTemplate, getCurrentContent]);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {});

    editor.onDidChangeModelContent(() => {});
  };

  const generatePreviewHtml = () => {
    return apiService.generatePreview(
      noteType,
      selectedCardIndex,
      previewData,
      selectedTemplate === "afmt"
    );
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineHeight: 22,
    padding: { top: 16, bottom: 16 },
    scrollBeyondLastLine: false,
    wordWrap: "on" as const,
    theme: "vs-light",
    automaticLayout: true,
    suggestOnTriggerCharacters: false,
    quickSuggestions: false,
    parameterHints: { enabled: false },
    hover: { enabled: false },
    links: false,
    colorDecorators: false,
    selectionHighlight: false,
  };

  useEffect(() => {
    setIsFlipped(selectedTemplate === "afmt");
  }, [selectedTemplate, selectedCardIndex]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const startX = e.clientX;
      const startWidth = previewPaneRef.current?.offsetWidth ?? previewWidth;
      const onMouseMove = (mv: MouseEvent) => {
        const w = Math.max(
          200,
          Math.min(700, startWidth + (startX - mv.clientX))
        );
        if (previewPaneRef.current)
          previewPaneRef.current.style.width = `${w}px`;
      };
      const onMouseUp = (mv: MouseEvent) => {
        setPreviewWidth(
          Math.max(200, Math.min(700, startWidth + (startX - mv.clientX)))
        );
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      e.preventDefault();
    },
    [previewWidth]
  );

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorWrapper}>
        <div className={styles.splitView}>
          <div className={styles.editorPane}>
            <Editor
              height="100%"
              language={getLanguage()}
              value={getCurrentContent()}
              onChange={(value) => updateContent(value || "")}
              onMount={handleEditorDidMount}
              options={editorOptions}
              className={styles.monacoEditor}
            />
          </div>
          <div
            className={styles.resizeHandle}
            onMouseDown={handleResizeMouseDown}
          />
          <div
            className={`${styles.previewPane}${
              isFullscreen ? ` ${styles.previewPaneFullscreen}` : ""
            }`}
            ref={previewPaneRef}
            style={isFullscreen ? undefined : { width: previewWidth }}
          >
            <div className={styles.previewHeader}>
              <span>
                Preview -{" "}
                {selectedTemplate === "css"
                  ? "Styling"
                  : selectedTemplate === "qfmt"
                  ? "Front"
                  : "Back"}
              </span>
              <div className={styles.previewActions}>
                <button
                  className={styles.fullscreenButton}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={
                    isFullscreen ? "Exit fullscreen" : "Fullscreen preview"
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="14"
                    height="14"
                    aria-hidden="true"
                  >
                    {isFullscreen ? (
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                    ) : (
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    )}
                  </svg>
                </button>
                <button
                  className={`${styles.mobileToggleButton}${
                    isMobilePreview ? ` ${styles.mobileToggleActive}` : ""
                  }`}
                  onClick={() => setIsMobilePreview(!isMobilePreview)}
                  title="Toggle mobile preview"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="14"
                    height="14"
                    aria-hidden="true"
                  >
                    <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className={styles.previewContent}>
              {selectedTemplate === "css" ? (
                <div
                  className={
                    isMobilePreview
                      ? styles.previewCardMobile
                      : styles.previewCard
                  }
                >
                  <iframe
                    className={styles.previewIframe}
                    srcDoc={generatePreviewHtml()}
                    title="Template Preview"
                  />
                </div>
              ) : (
                <>
                  <div
                    className={
                      isMobilePreview
                        ? styles.cardFlipWrapperMobile
                        : styles.cardFlipWrapper
                    }
                    onClick={() => setIsFlipped((f) => !f)}
                    title="Click to flip"
                  >
                    <div
                      className={`${styles.cardFlipInner}${
                        isFlipped ? " " + styles.cardFlipped : ""
                      }`}
                    >
                      <div className={styles.cardFace}>
                        <iframe
                          className={styles.previewIframe}
                          srcDoc={apiService.generatePreview(
                            noteType,
                            selectedCardIndex,
                            previewData,
                            false
                          )}
                          title="Front"
                        />
                      </div>
                      <div
                        className={`${styles.cardFace} ${styles.cardFaceBack}`}
                      >
                        <iframe
                          className={styles.previewIframe}
                          srcDoc={apiService.generatePreview(
                            noteType,
                            selectedCardIndex,
                            previewData,
                            true
                          )}
                          title="Back"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className={styles.flipHint}
                    onClick={() => setIsFlipped((f) => !f)}
                  >
                    {isFlipped ? "‹ flip to front" : "flip to back ›"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className={styles.validationErrors}>
          {validationErrors.map((error, i) => (
            <div key={i} className={styles.validationError}>
              <span className={styles.validationErrorLine}>
                Line {error.line}:
              </span>
              {error.message}
            </div>
          ))}
        </div>
      )}

      {/* Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span>
            {getLanguage().toUpperCase()} • Line {1}, Col {1}
          </span>
          <span>
            {noteType.flds.length} fields • {noteType.tmpls.length} cards
          </span>
        </div>
        {selectedTemplate === "css" && (
          <div className={styles.statusRight}>
            <button
              className={styles.resetCssButton}
              onClick={() => updateContent(defaultCss)}
              title="Reset CSS to default"
            >
              Reset CSS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonacoEditorWrapper;
