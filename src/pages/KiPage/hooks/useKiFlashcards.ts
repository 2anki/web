import React, { useState, useCallback, useRef } from 'react';
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
  // Create a ref to track cards during processing
  const cardsRef = useRef<Card[]>([]);

  // Parse card from event data
  const parseCard = useCallback((data: string) => {
    try {
      // Try to clean up the data if it's not valid JSON
      const cleanData = data.trim();
      
      // Try to parse the JSON
      const parsed = JSON.parse(cleanData);
      
      // Validate that it has the required fields
      if (!parsed.front && !parsed.back && !parsed.deck) {
        // Card is missing required fields
      }
      
      return parsed;
    } catch (err) {
      // Try to handle partial JSON or malformed data
      try {
        // Sometimes the server might send malformed JSON with extra characters
        const fixedData = data.replace(/[\r\n]+/g, '').trim();
        const match = fixedData.match(/\{.*\}/);
        if (match) {
          return JSON.parse(match[0]);
        }
      } catch (fixErr) {
        // Ignore error parsing fixed JSON
      }
      
      return null;
    }
  }, []);

  // Handle card event
  const handleCardEvent = useCallback((data: string, cardCollection: React.MutableRefObject<Card[]>) => {
    const card = parseCard(data);
    if (card) {
      
      // Update the ref first to keep track of all cards during processing
      const updatedCards = [...cardCollection.current, card];
      // eslint-disable-next-line no-param-reassign
      cardCollection.current = updatedCards;

      
      // Then update the state to trigger UI updates
      setCards(updatedCards);
      
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

      return false;
    }
  }, []);

  // Generate flashcards from text or files
  const generateFlashcards = useCallback(async (text: string, formData?: FormData) => {
    // Clear previous results
    cardsRef.current = [];
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

      // Prepare request data
      let requestBody;
      let headers = {};

      // If we have files, use FormData to send multipart/form-data
      if (formData) {
        // Add text to the existing FormData
        formData.append('text', text);
        requestBody = formData;
        // Don't set Content-Type header for multipart/form-data
        // The browser will set it automatically with the boundary
      } else {
        // If we only have text, use JSON
        requestBody = JSON.stringify({ text });
        headers = {
          'Content-Type': 'application/json'
        };
      }

      // Use the existing API utility for consistent redirect handling
      const response = await fetch('/ki/generate', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: requestBody,
        signal
      });
      

      
      if (!response.ok) {
        // Try to get more detailed error information
        try {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || response.statusText}`);
        } catch (textError) {
          // If we can't get the response text, fall back to basic error
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Check if we have a response body
      if (!response.body) {
        throw new Error('Response has no body');
      }
      

      
      // Process the stream
      const reader = response.body.getReader();
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

          if (!eventType || !data) {
            return;
          }


          
          if (eventType === 'card') {
            handleCardEvent(data, cardsRef);
            // Process card event result
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
              // Ignore progress parsing errors
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
      
      // Final update with all collected cards

      
      // Set the final cards state
      setCards([...cardsRef.current]);
      
      // Final check of cards before setting isProcessing to false
      // Final check complete
      
      setIsProcessing(false);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // Request was cancelled by user
      } else {
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
