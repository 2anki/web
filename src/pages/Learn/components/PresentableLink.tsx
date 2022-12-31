import NotionObject from "../../../lib/interfaces/NotionObject";
import { SourceLink } from "./SourceLink";

interface PresentableLinkProps {
  object: NotionObject | null | undefined;
}

export function PresentableLink({ object }: PresentableLinkProps) {
  if (!object) {
    return null;
  }

  const { url, title } = object;

  return (
    <p className="subtitle">
      <small>
        <SourceLink link={url} title={title} />
      </small>
    </p>
  );
}
