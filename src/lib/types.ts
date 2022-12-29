// TODO: generate this file from the database

export interface Settings {
  object_id: string;
  payload: { [key: string]: string };
}

export interface Rules {
  id: number;
  object_id: string;
  flashcard_is: string;
  deck_is: string;
  sub_deck_is: string;
  tags_is: string;
  owner: number;
  email_notification: boolean;
}

export interface Favorite {
  owner: number;
  object_id: string;
  type: string;
}

export type SettingsPayload = { [key: string]: string };

export interface ActiveJob {
  object_id: string;
  status: string;
  title: string;
}

export interface ObjectIcon {
  icon: {
    emoji: string;
    type: string;
    external: {
      url: string;
    };
    file: {
      url: string;
    };
  };
}

export interface ObjectTitle {
  title: [
    {
      type: string;
      text: { content: string; href: string };
      plain_text: string;
    }
  ];
  object: string;
  properties: {
    Name: { title: { plain_text: string } };
    title: {
      title: [{ type: string; text: { content: string }; plain_text: string }];
    };
  };
}
