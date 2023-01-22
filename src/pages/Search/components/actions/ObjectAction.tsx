/* eslint-disable react/require-default-props */
import { MouseEventHandler } from 'react';
import { ObjectIconAction } from '../SearchObjectEntry/styled';

interface ObjectActionProps {
  url: string;
  image: string;
  filename?: string;
  onClick?: MouseEventHandler;
}

export default function ObjectAction({
                                       url,
                                       image,
                                       filename,
                                       onClick
                                     }: ObjectActionProps) {
  return (
    <a download={filename} href={url} target="_blank" rel="noreferrer" onClick={onClick}>
      <ObjectIconAction alt="Page action" width="32px" src={image} />
    </a>
  );
}
