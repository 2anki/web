import { Dispatch, SetStateAction } from "react";
import { ErrorHandlerType } from "../../../components/errors/helpers/types";
import Backend from "../../../lib/backend";
import NotionObject from "../../../lib/interfaces/NotionObject";
import usePatreon from "../../MyUploads/hooks/usePatreon";
import SearchObjectEntry from "./SearchObjectEntry";

interface ListSearchResultsProps {
  results: NotionObject[];
  setFavorites: Dispatch<SetStateAction<NotionObject[]>>;
  handleEmpty?: boolean;
  setError: ErrorHandlerType;
}

export default function ListSearchResults(
  props: ListSearchResultsProps
): JSX.Element {
  const { results, handleEmpty, setFavorites, setError } = props;
  const isEmpty = results.length < 1;
  const [isPatron] = usePatreon(new Backend());

  if (isEmpty && handleEmpty) {
    return (
      <div className="column is-main-content">
        <div className="subtitle my-4">
          No search results, try typing something above 👌🏾 Also ensure you{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.notion.so/help/guides/understanding-notions-sharing-settings"
          >
            understand notions sharing settings
          </a>
        </div>
      </div>
    );
  }
  return (
    <>
      {results.map((p) => (
        <SearchObjectEntry
          isPatron={isPatron}
          setError={setError}
          setFavorites={setFavorites}
          isFavorite={p.isFavorite}
          type={p.object}
          key={p.url}
          title={p.title}
          icon={p.icon}
          url={p.url}
          id={p.id}
        />
      ))}
    </>
  );
}

ListSearchResults.defaultProps = {
  handleEmpty: true
};
