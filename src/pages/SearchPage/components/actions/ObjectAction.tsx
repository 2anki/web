import { MouseEventHandler } from 'react';
import styles from '../SearchObjectEntry/SearchObjectEntry.module.css';

export interface ObjectActionProps {
  url: string;
  image: string;
  onClick?: MouseEventHandler;
}

export default function ObjectAction({
  url,
  image,
  onClick,
}: Readonly<ObjectActionProps>) {
  return (
    <a href={url} target="_blank" rel="noreferrer" onClick={onClick}>
      <img
        className={styles.objectIconAction}
        alt="Page action"
        width="32"
        src={image}
      />
    </a>
  );
}
