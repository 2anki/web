import { Dispatch, SetStateAction, useState } from 'react';

import DefineRules from '../DefineRules';

import ObjectActions from '../actions/ObjectActions';
import ObjectAction from '../actions/ObjectAction';
import { Entry, ObjectMeta } from './styled';
import DotsHorizontal from '../../../../components/icons/DotsHorizontal';
import NotionObject from '../../../../lib/interfaces/NotionObject';
import { OK } from '../../../../lib/backend/http';
import { BlockIcon } from '../BlockIcon';
import { ErrorHandlerType } from '../../../../components/errors/helpers/getErrorMessage';
import { get2ankiApi } from '../../../../lib/backend/get2ankiApi';

interface Props {
  isFavorite: boolean | undefined;
  title: string;
  icon: string | undefined;
  url: string;
  id: string;
  type: string;
  setFavorites: Dispatch<SetStateAction<NotionObject[]>>;
  setError: ErrorHandlerType;
}

/**
 * Unfortunately due to the implementation of favorites, there is some type mismatch.
 * When that is cleaned up this can be deleted.
 */
const getType = (data: string | { object: string }): string | null => {
  if (typeof data === 'object' && 'object' in data) {
    return data.object;
  }
  return typeof data === 'string' ? data : null;
};

function SearchObjectEntry(props: Props) {
  const { title, icon, url, id, type, isFavorite, setFavorites, setError } =
    props;
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <Entry data-hj-suppress>
        <ObjectMeta>
          <BlockIcon icon={icon} />
          <span className="subtitle is-6">{title}</span>
        </ObjectMeta>
        <ObjectActions>
          <ObjectAction
            url={url}
            image="/icons/Anki_app_logo.png"
            onClick={(event) => {
              event.preventDefault();
              get2ankiApi()
                .convert(id, getType(type), title)
                .then((response) => {
                  if (response.status === OK) {
                    window.location.href = '/uploads';
                  } else {
                    response.text().then(setError);
                  }
                })
                .catch((error) => {
                  setError(error);
                });
            }}
          />
          <ObjectAction url={url} image="/icons/Notion_app_logo.png" />
          <div
            role="button"
            tabIndex={-1}
            onClick={() => setShowSettings(!showSettings)}
            onKeyDown={(event) => {
              if (event.key === 'F1') {
                setShowSettings(!showSettings);
              }
            }}
          >
            <DotsHorizontal width={32} height={32} />
          </div>
        </ObjectActions>
      </Entry>
      {showSettings && (
        <DefineRules
          setError={setError}
          type={getType(type)}
          isFavorite={isFavorite}
          setFavorites={setFavorites}
          parent={title}
          id={id}
          setDone={() => setShowSettings(false)}
        />
      )}
    </>
  );
}

export default SearchObjectEntry;
