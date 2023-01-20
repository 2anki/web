import ObjectAction from '../../Search/components/actions/ObjectAction';
import { Entry, ObjectActions, ObjectMeta, UploadTitle } from './styled';
import { DeleteButton } from './ListJobs/DeleteButton';

interface Props {
  title: string;
  icon: string | null;
  url: string;
  deleteUpload: () => void;
}

export default function UploadObjectEntry({
                                            title,
                                            icon,
                                            url,
                                            deleteUpload
                                          }: Props) {
  return (
    <Entry>
      <ObjectMeta>
        <DeleteButton onDelete={deleteUpload} />
        {icon && <span>{icon}</span>}
        <div />
        <UploadTitle
          data-hj-suppress
          className="subtitle ml-2 is-6"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </ObjectMeta>
      <ObjectActions>
        <ObjectAction url={url} image="/icons/Anki_app_logo.png" />
      </ObjectActions>
    </Entry>
  );
}
