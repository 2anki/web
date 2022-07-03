import styled from 'styled-components';

import ObjectAction from '../../Search/components/actions/ObjectAction';
import { Entry, ObjectActions, ObjectMeta, UploadTitle } from './styled';

interface Props {
  size: string;
  title: string;
  icon: string;
  url: string;
  deleteUpload: () => void;
}

export default function UploadObjectEntry({
  size, title, icon, url, deleteUpload,
}: Props) {
  return (
    <Entry>
      <ObjectMeta>
        <button type="button" className="delete" onClick={() => deleteUpload()}>
          Delete
        </button>
        <div className="control">
          <div className="tags has-addons">
            <span className="tag is-info">Size</span>
            <span className="tag">
              {size}
              {' '}
              MB
            </span>
          </div>
        </div>
        <span>{icon}</span>
        <UploadTitle className="subtitle is-6">
          {title}
        </UploadTitle>
      </ObjectMeta>
      <ObjectActions>
        <ObjectAction
          url={url}
          image="/icons/Anki_app_logo.png"
        />
      </ObjectActions>
    </Entry>
  );
}
