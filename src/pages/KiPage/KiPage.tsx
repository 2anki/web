import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { KiCard } from './components/KiCard';
import { KiInput } from './components/KiInput';
import { KiHeader } from './components/KiHeader';
import { KiModal } from './components/KiModal';
import { KiProcessingState } from './components/KiProcessingState';
import { KiToast } from './components/KiToast';
import { useKiSession } from './hooks/useKiSession';
import { useKiFlashcards } from './hooks/useKiFlashcards';
import { Card, UploadedFile } from './types';
import KiStyles from './KiStyles';

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: calc(180px + var(--spacing-lg));
  overflow-x: hidden;
  max-width: var(--container-max-width);
  position: relative;
`;

const Results = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  margin-bottom: 180px;
`;

const CardsContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-md);
  min-height: 100%;
`;

function KiPage(): React.ReactElement {
  const navigate = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(() => localStorage.getItem('debug') === 'true');
  const [inputText, setInputText] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const {
    cards: generatedCards,
    isProcessing,
    processingState,
    generateFlashcards,
    cancelProcessing,
    downloadDeck,
    error,
    setCards
  } = useKiFlashcards();
  
  const {
    currentSession,
    sessionHistory,
    loadSession,
    startNewSession,
    deleteSession
  } = useKiSession();
  
  // Determine which cards to display - either from the current session or from generated cards
  // If we're processing or have generated cards, always show those first
  const cards = isProcessing || generatedCards.length > 0 ? generatedCards : (currentSession?.cards || []);
  
  // Add debugging to track card state
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Current display cards:', cards.length, 'Generated cards:', generatedCards.length);
    if (cards.length > 0) {
      // eslint-disable-next-line no-console
      console.log('First card:', cards[0]);
    }
  }, [cards, generatedCards]);

  const cardsContainerRef = useRef<HTMLDivElement>(null);
  // Virtual scroller is disabled due to type issues
  // useVirtualScroller(cardsContainerRef);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/me', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) {
          // eslint-disable-next-line no-console
          console.warn('User is not authenticated, redirecting to login page');
          navigate('/login?redirect=/ki');
          return;
        }
        
        setIsCheckingAuth(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error checking authentication status:', err);
        navigate('/login?redirect=/ki');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Show disclaimer on first visit
  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('ki_seen_disclaimer');
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    }
  }, []);

  const closeDisclaimer = () => {
    localStorage.setItem('ki_seen_disclaimer', 'true');
    setShowDisclaimer(false);
  };

  const toggleDebug = () => {
    const newDebugState = !isDebugMode;
    localStorage.setItem('debug', newDebugState.toString());
    setIsDebugMode(newDebugState);
  };
  
  // Session management is now handled in the KiHeader component

  const showToast = (message: string, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle file upload
  const handleFileUpload = useCallback((files: FileList) => {
    if (files.length === 0) return;
    
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    generateFlashcards('', formData);
  }, [generateFlashcards]);

  // Handle text input
  const handleTextSubmit = useCallback((text: string) => {
    if (!text.trim()) {
      showToast('Please enter text or upload a file', 'error');
      return;
    }
    
    // When generating new flashcards, we're working with the current session
    setInputText(text); // Save the input text
    generateFlashcards(text);
  }, [generateFlashcards]);

  // Handle session operations
  const handleSessionLoad = useCallback(async (sessionId: string) => {
    try {
      // First clear the generated cards to avoid any state mixing during transition
      setCards([]);
      
      const success = await loadSession(sessionId);
      if (success) {
        // Clear input text when loading a session
        setInputText('');
        showToast('Session loaded successfully', 'success');
      } else {
        showToast('Failed to load session', 'error');
      }
    } catch (err) {
      showToast('Failed to load session', 'error');
    }
  }, [loadSession, setCards]);

  const handleNewSession = useCallback(async () => {
    try {
      const success = await startNewSession();
      if (success) {
        // Clear any cards and input text when starting a new session
        setCards([]);
        setInputText('');
        showToast('New session started', 'success');
      } else {
        showToast('Failed to start new session', 'error');
      }
    } catch (err) {
      showToast('Failed to start new session', 'error');
    }
  }, [startNewSession, setCards]);

  const handleSessionDelete = useCallback(async () => {
    try {
      const success = await deleteSession();
      if (success) {
        // Clear any cards and input text when deleting a session
        setCards([]);
        setInputText('');
        showToast('Session deleted', 'success');
      } else {
        showToast('Failed to delete session', 'error');
      }
    } catch (err) {
      showToast('Failed to delete session', 'error');
    }
  }, [deleteSession, setCards]);

  // Handle deck download
  const handleDownload = useCallback(async (name?: string) => {
    try {
      await downloadDeck(name, currentSession?.id);
    } catch (err) {
      showToast('Failed to download deck', 'error');
    }
  }, [downloadDeck, currentSession?.id]);

  // Display error messages
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <>
        <KiStyles />
        <Container>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Loading Ki Page...</p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <KiStyles />
      <KiHeader 
        isDebugMode={isDebugMode} 
        toggleDebug={toggleDebug}
        sessionHistory={sessionHistory}
        currentSession={currentSession}
        onLoadSession={handleSessionLoad}
        onNewSession={handleNewSession}
        onDeleteSession={handleSessionDelete}
      />
      
      <Container>
        <Results id="results">
          <CardsContainer ref={cardsContainerRef}>
            {isProcessing && (
              <KiProcessingState 
                state={processingState} 
                onCancel={cancelProcessing} 
              />
            )}
            
            {!isProcessing && cards.length === 0 && currentSession?.uploadedFiles && currentSession.uploadedFiles.length > 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color-secondary)' }}>
                <h3>No flashcards were generated</h3>
                <p>The file was processed but no flashcards could be created. Try with different content or use the text input.</p>
                {currentSession.uploadedFiles.map((file: UploadedFile) => (
                  <div key={`file-${file.path}`} style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    <span>Uploaded file: {file.name}</span>
                  </div>
                ))}
              </div>
            )}

            {!isProcessing && cards.length === 0 && (!currentSession?.uploadedFiles || currentSession.uploadedFiles.length === 0) && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color-secondary)' }}>
                <h3>No content to display</h3>
                <p>Enter some text or upload a file to generate flashcards.</p>
              </div>
            )}
            
            {cards.map((card: Card, index: number) => (
              <KiCard 
                key={`${currentSession?.id || 'current'}-card-${card.id || index}-${card.front?.substring(0, 10) || ''}`} 
                card={card} 
                isDebugMode={isDebugMode} 
              />
            ))}
          </CardsContainer>
        </Results>
        
        <KiInput 
          onTextSubmit={handleTextSubmit}
          onFileUpload={handleFileUpload}
          onDownload={handleDownload}
          isProcessing={isProcessing}
          inputText={inputText}
        />
      </Container>
      
      {showDisclaimer && (
        <KiModal 
          title="Welcome to the New KI 🧪 Interface!" 
          onClose={closeDisclaimer}
          isOpen={showDisclaimer}
        >
          <p>
            This is an experimental interface for generating flashcards using AI. 
            It&apos;s designed to help you create high-quality Anki cards quickly from your content.
          </p>
          <p>
            <strong>How to use:</strong>
          </p>
          <ul>
            <li>Enter text directly or upload files</li>
            <li>The AI will process your content and generate flashcards</li>
            <li>Review the cards and download as an Anki deck</li>
          </ul>
          <p>
            <strong>Note:</strong> This feature is available to premium users only.
          </p>
        </KiModal>
      )}
      
      {toast && <KiToast message={toast.message} type={toast.type} />}
    </>
  );
};

export default KiPage;
