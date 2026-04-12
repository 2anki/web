import { NotionData } from '../helpers/useNotionData';
import styles from '../../../styles/shared.module.css';

interface WorkspaceHeaderProps {
  notionData: NotionData;
}

export default function WorkSpaceHeader(props: WorkspaceHeaderProps) {
  const { notionData } = props;
  const { workSpace, connectionLink } = notionData;

  return (
    <div className={`${styles.flexCenter} ${styles.workspaceBar}`}>
      <div>
        <span className={styles.tagInfo}>workspace</span>
        <header>
          <h1 data-hj-suppress>{workSpace}</h1>
        </header>
      </div>
      <div>
        <a href={connectionLink} className={styles.btnSmall}>
          Switch
        </a>
      </div>
    </div>
  );
}
