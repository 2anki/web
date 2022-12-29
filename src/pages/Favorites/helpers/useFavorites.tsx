import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Backend from '../../../lib/backend';
import NotionObject from '../../../lib/interfaces/NotionObject';

export default function useFavorites(
  backend: Backend
): [
  loading: boolean,
  favorites: NotionObject[],
  setFavorites: Dispatch<SetStateAction<NotionObject[]>>
] {
  const [favorites, setFavorites] = useState<NotionObject[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    backend.getFavorites().then((input) => {
      setFavorites(input);
      setLoading(false)
    });
  }, []);
  return [loading, favorites, setFavorites];
}
