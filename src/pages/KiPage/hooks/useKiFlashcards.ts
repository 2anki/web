import { useState, useCallback, useRef } from 'react';
import { Card, ProcessingState } from '../types';

export const useKiFlashcards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    message: 'Starting process...',
    progress: 0
  });
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Parse card from event data
  const parseCard = useCallback((data: string) => {
    try {
      return JSON.parse(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse card data:', err);
      return null;
    }
  }, []);

  // Handle card event
  const handleCardEvent = useCallback((data: string) => {
    const card = parseCard(data);
    if (card) {
      setCards(prevCards => [...prevCards, card]);
      return true;
    }
    return false;
  }, [parseCard]);

  // Handle status event
  const handleStatusEvent = useCallback((data: string) => {
    try {
      const status = JSON.parse(data);
      if (status.message) {
        setProcessingState(prev => ({
          ...prev,
          message: status.message,
          progress: status.progress || prev.progress
        }));
      }
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse status data:', err);
      return false;
    }
  }, []);

  // Generate flashcards from text or files
  const generateFlashcards = useCallback(async (text: string, formData?: FormData) => {
    // Clear previous results
    setCards([]);
    setError(null);
    setIsProcessing(true);
    setProcessingState({
      message: 'Starting process...',
      progress: 0,
      text: text || undefined,
      files: formData ? Array.from(formData.getAll('files') as File[]) : undefined
    });

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      // Handle file uploads first if any
      if (formData) {
        setProcessingState(prev => ({
          ...prev,
          message: 'Uploading files...'
        }));

        const uploadResponse = await fetch('/ki/upload', {
          method: 'POST',
          body: formData,
          signal
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Upload failed: ${errorText || uploadResponse.statusText}`);
        }

        // Wait for upload to be processed
        await new Promise(resolve => {
          const timeoutId = setTimeout(() => {
            resolve(undefined);
          }, 500);
          // Cleanup function, not a return value
          // eslint-disable-next-line no-promise-executor-return
          return () => clearTimeout(timeoutId);
        });
      }

      // Generate flashcards
      setProcessingState(prev => ({
        ...prev,
        message: 'Initializing AI session...'
      }));

      // Use the existing API utility for consistent redirect handling
      const response = await fetch('/ki/generate', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          files: formData ? Array.from(formData.getAll('files') as File[]).map(f => f.name) : []
        }),
        signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Process the stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      // Process a single chunk from the reader
      const processChunk = async () => {
        const { value, done } = await reader.read();
        if (done) {
          return false; // Signal we're done reading
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        // Process all events in the buffer
        events.forEach(event => {
          const lines = event.split('\n');
          const eventType = lines.find(line => line.startsWith('event:'))?.replace('event:', '').trim();
          const data = lines.find(line => line.startsWith('data:'))?.replace('data:', '').trim();

          if (!eventType || !data) return;

          if (eventType === 'card') {
            handleCardEvent(data);
          } else if (eventType === 'status') {
            handleStatusEvent(data);
          } else if (eventType === 'progress') {
            try {
              const progress = JSON.parse(data);
              setProcessingState(prev => ({
                ...prev,
                progress: progress.percent || 0,
                message: progress.message || prev.message
              }));
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('Failed to parse progress data:', err);
            }
          }
        });
        
        return true; // Signal to continue reading
      };
      
      // Process all chunks until done
      const processAllChunks = async () => {
        let shouldContinue = true;
        while (shouldContinue) {
          // eslint-disable-next-line no-await-in-loop
          shouldContinue = await processChunk();
        }
      };
      
      await processAllChunks();
      setProcessingState(prev => ({
        ...prev,
        message: 'Processing complete!',
        progress: 100
      }));

      // Delay to show completion state
      await new Promise(resolve => {
        const timeoutId = setTimeout(() => {
          resolve(undefined);
        }, 1000);
        // Cleanup function, not a return value
        // eslint-disable-next-line no-promise-executor-return
        return () => clearTimeout(timeoutId);
      });
      setIsProcessing(false);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // eslint-disable-next-line no-console
        console.log('Request was cancelled');
      } else {
        // eslint-disable-next-line no-console
        console.error('Error generating flashcards:', err);
        setError((err as Error).message);
        setIsProcessing(false);
      }
    }
  }, [handleCardEvent, handleStatusEvent]);

  // Cancel processing
  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsProcessing(false);
  }, []);

  // Download deck
  const downloadDeck = useCallback(async (name?: string, sessionId?: string) => {
    if (cards.length === 0 && !sessionId) {
      setError('No cards to download');
      return;
    }

    try {
      const deckName = name || 'Ki Deck';
      
      // The server expects a simple JSON object with a name property
      // It will use the session data from the user's current session
      interface DownloadRequest {
        name: string;
        sessionId?: string;
      }
      
      const requestData: DownloadRequest = {
        name: deckName
      };
      
      // If we have a session ID, we can include it
      if (sessionId) {
        requestData.sessionId = sessionId;
      }
      
      // Use the existing API utility for consistent redirect handling
      const response = await fetch('/ki/download', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Create a download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${deckName}.apkg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error downloading deck:', err);
      setError((err as Error).message);
    }
  }, [cards]);

  return {
    cards,
    isProcessing,
    processingState,
    generateFlashcards,
    cancelProcessing,
    downloadDeck,
    error,
    setCards
  };
};
