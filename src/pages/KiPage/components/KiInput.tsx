import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface KiInputProps {
  onTextSubmit: (text: string) => void;
  onFileUpload: (files: FileList) => void;
  onDownload: (name?: string) => void;
  isProcessing: boolean;
  inputText?: string;
}

const InputContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-lg);
  background: rgba(248, 250, 252, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-color);
  z-index: 1000;
  max-width: var(--container-max-width);
  margin: 0 auto;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.03);
`;

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-normal);
  backdrop-filter: blur(8px);
  
  &:focus-within {
    border-color: var(--primary-light);
    box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: var(--editor-height);
  padding: var(--spacing-lg);
  border: none;
  resize: none;
  font-family: var(--font-ui);
  font-size: 16px;
  line-height: 1.8;
  outline: none;
  color: var(--text-primary);
  background: transparent;

  &::placeholder {
    color: var(--text-tertiary);
    opacity: 0.8;
    font-weight: var(--font-weight-normal);
  }
  
  &:focus {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  background: var(--bg-tertiary);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const Button = styled.button<{ primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: none;
  background: ${props => props.primary ? 'var(--primary)' : 'var(--bg-primary)'};
  color: ${props => props.primary ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.primary ? 'var(--primary)' : 'var(--border-color)'};
  box-shadow: ${props => props.primary ? 'var(--shadow-sm)' : 'none'};
  letter-spacing: 0.01em;

  &:hover {
    background: ${props => props.primary ? 'var(--primary-dark)' : 'var(--hover-bg)'};
    color: ${props => props.primary ? 'white' : 'var(--primary)'};
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
    border-color: ${props => props.primary ? 'var(--primary-dark)' : 'var(--primary-light)'};
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition-fast);
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);

  &:hover {
    background: var(--bg-secondary);
  }
`;

const DropZone = styled.div<{ isDragActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: ${props => props.isDragActive ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(79, 70, 229, 0.2);
  border: 2px dashed var(--primary);
  z-index: 10;
  pointer-events: none;
  color: var(--text-primary);
  font-weight: 600;
`;

export function KiInput({ 
  onTextSubmit, 
  onFileUpload, 
  onDownload,
  isProcessing,
  inputText
}: KiInputProps): React.ReactElement {
  const [text, setText] = useState(inputText || '');
  const [isDragActive, setIsDragActive] = useState(false);
  const [downloadName, setDownloadName] = useState('');
  const [showDownloadInput, setShowDownloadInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  // Reset text when inputText prop changes (e.g., when switching sessions)
  useEffect(() => {
    if (inputText !== undefined) {
      setText(inputText);
    }
  }, [inputText]);
  
  // Reset function is handled through the inputText prop changes

  const handleSubmit = () => {
    onTextSubmit(text);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
    }
  };

  const handleDownload = () => {
    if (showDownloadInput) {
      onDownload(downloadName || undefined);
      setShowDownloadInput(false);
      setDownloadName('');
    } else {
      setShowDownloadInput(true);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <InputContainer>
      <EditorContainer
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <TextArea
          name="text"
          placeholder="Enter text to generate flashcards or upload files..."
          value={text}
          onChange={handleTextChange}
          disabled={isProcessing}
        />
        
        <DropZone isDragActive={isDragActive}>
          <h3>Drop files here</h3>
          <p>Upload PDF, DOCX, HTML, TXT, or ZIP files</p>
        </DropZone>
        
        <ToolbarContainer>
          <ButtonGroup>
            <UploadButton htmlFor="files">
              📎 Upload Files
            </UploadButton>
            <FileInput
              id="files"
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </ButtonGroup>
          
          <ButtonGroup>
            {showDownloadInput ? (
              <>
                <input
                  type="text"
                  placeholder="Deck name"
                  value={downloadName}
                  onChange={(e) => setDownloadName(e.target.value)}
                  style={{ padding: '8px', borderRadius: 'var(--radius-md)' }}
                />
                <Button onClick={handleDownload}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3d/Anki-icon.svg" 
                    style={{width: '16px', height: '16px', marginRight: '8px', verticalAlign: 'middle'}} 
                    alt="Anki" /> Download
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleDownload} disabled={isProcessing}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3d/Anki-icon.svg" 
                    style={{width: '16px', height: '16px', marginRight: '8px', verticalAlign: 'middle'}} 
                    alt="Anki" /> Download
                </Button>
                <Button 
                  primary 
                  onClick={handleSubmit} 
                  disabled={isProcessing || (!text.trim() && (!fileInputRef.current || !fileInputRef.current.files || fileInputRef.current.files.length === 0))}
                >
                  📝 Generate Flashcards
                </Button>
              </>
            )}
          </ButtonGroup>
        </ToolbarContainer>
      </EditorContainer>
    </InputContainer>
  );
};
