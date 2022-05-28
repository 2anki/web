import { AxiosResponse } from 'axios';

interface NotionObject {
  object: string;
  title: string;
  url: string;
  icon?: string;
  id: string;
  data?: AxiosResponse;
  isFavorite?: boolean;
}

export default NotionObject;
