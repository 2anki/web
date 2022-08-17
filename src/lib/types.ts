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

// TODO: add more types from lib/types
