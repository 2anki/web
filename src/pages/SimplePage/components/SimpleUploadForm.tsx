import { SyntheticEvent, useRef } from 'react';
import { ErrorHandlerType } from '../../../components/errors/helpers/getErrorMessage';
import handleRedirect from '../../../lib/handleRedirect';
import { useDrag } from '../../UploadPage/components/UploadForm/hooks/useDrag';
import DropParagraph from './DropParagraph';
import getAcceptedContentTypes from '../../UploadPage/helpers/getAcceptedContentTypes';

export interface CreatedDeck {
  name: string;
  link: string;
}

interface UploadFormProps {
  setErrorMessage: ErrorHandlerType;
  onDecksCreated: (decks: CreatedDeck[]) => void;
}

function SimpleUploadForm({
                            setErrorMessage,
                            onDecksCreated
                          }: Readonly<UploadFormProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const convertRef = useRef<HTMLButtonElement>(null);
  const { dropHover } = useDrag({
    onDrop: (event) => {
      const { dataTransfer } = event;

      if (dataTransfer && dataTransfer.files.length > 0) {
        fileInputRef.current!.files = dataTransfer.files;
        convertRef.current?.click();
      }

      event.preventDefault();
    }
  });

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const storedFields = Object.entries(window.localStorage);
      const element = event.currentTarget as HTMLFormElement;
      const formData = new FormData(element);
      storedFields.forEach((sf) => formData.append(sf[0], sf[1]));
      const request = await window.fetch('/api/simple-upload/file', {
        method: 'post',
        body: formData
      });
      if (request.redirected) {
        return handleRedirect(request);
      }

      const response = await request.json();

      if ('error' in response) {
        setErrorMessage(new Error(response.error));
      } else {
        onDecksCreated(response);
      }
    } catch (error) {
      setErrorMessage(error as Error);
      return false;
    }
    return true;
  };

  const fileSelected = () => {
    convertRef.current?.click();
  };

  return (
    <form
      encType="multipart/form-data"
      method="post"
      onSubmit={(event) => {
        handleSubmit(event);
      }}
    >
      <div className="field">
        <DropParagraph hover={dropHover}>
          <h1>Drag a file and Drop it here</h1>
          <p className="my-2">
            <i>or</i>
          </p>
          <label htmlFor="pakker">
            <input
              ref={fileInputRef}
              className="file-input"
              type="file"
              name="pakker"
              accept={getAcceptedContentTypes()}
              required
              multiple
              onChange={() => fileSelected()}
            />
          </label>
          <span className="tag">Select</span>
        </DropParagraph>
      </div>
      <button
        aria-label="Upload file"
        style={{ visibility: 'hidden', display: 'none' }}
        ref={convertRef}
        type="submit"
      />
    </form>
  );
}

export default SimpleUploadForm;
