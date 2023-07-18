import { Dispatch, SetStateAction, useState } from 'react';

import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { isFullDatabase } from '@notionhq/client';
import Backend from '../../../../lib/backend';
import DefineRules from '../DefineRules';

import ObjectActions from '../actions/ObjectActions';
import ObjectAction from '../actions/ObjectAction';
import { Entry, ObjectMeta } from './styled';
import DotsHorizontal from '../../../../components/icons/DotsHorizontal';
import NotionObject from '../../../../lib/interfaces/NotionObject';
import {
  ErrorHandlerType,
  ErrorType
} from '../../../../components/errors/helpers/types';
import { OK } from '../../../../lib/backend/http';
import { BlockIcon } from '../BlockIcon';

const backend = new Backend();

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
const getType = (data: string | DatabaseObjectResponse): string | null => {
  const dbObject = data as DatabaseObjectResponse;
  if (isFullDatabase(dbObject)) {
    return dbObject.object;
  }

  return typeof data === 'string' ? data : null;
}

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
              backend
                .convert(id, getType(type), title)
                .then((response) => {
                  if (response.status === OK) {
                    window.location.href = '/uploads';
                  } else {
                    response.text().then(setError);
                  }
                })
                .catch((error) => {
                  setError(error as ErrorType);
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
