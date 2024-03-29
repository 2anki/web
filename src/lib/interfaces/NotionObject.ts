interface NotionObject {
  object: string;
  title: string;
  url: string;
  icon?: string;
  id: string;
  data?: Response;
  isFavorite?: boolean;
}

export default NotionObject;
