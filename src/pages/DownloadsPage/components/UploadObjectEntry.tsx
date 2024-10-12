import { Entry, ObjectActions, ObjectMeta, UploadTitle } from './styled';
import { DeleteButton } from './ListJobs/DeleteButton';
import { ObjectIconAction } from '../../SearchPage/components/SearchObjectEntry/styled';
import { getDownloadFileName } from '../helpers/getDownloadFileName';

interface Props {
  title: string;
  url: string;
  deleteUpload: () => void;
}

export default function UploadObjectEntry({
                                            title,
                                            url,
                                            deleteUpload
                                          }: Props) {
  return (
    <Entry>
      <ObjectMeta>
        <DeleteButton onDelete={deleteUpload} />
        <div />
        <UploadTitle
          data-hj-suppress
          className="subtitle ml-2 is-6"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </ObjectMeta>
      <ObjectActions>
        <a
          download={getDownloadFileName(title)}
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          <ObjectIconAction
            alt="Page action"
            width="32px"
            src="/icons/Anki_app_logo.png"
          />
        </a>
      </ObjectActions>
    </Entry>
  );
}
