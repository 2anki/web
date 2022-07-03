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
        {icon && <span>{icon}</span>}
        <div />
        <UploadTitle className="subtitle ml-2 is-6" dangerouslySetInnerHTML={{ __html: title }} />
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
