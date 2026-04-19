import { NoteBaseType } from "./NoteBaseType";

export interface AnkiField {
  name: string;
  ord: number;
  sticky: boolean;
  rtl: boolean;
  font: string;
  size: number;
  description?: string;
}

export interface AnkiCardType {
  name: string;
  ord: number;
  qfmt: string; // Question format (front template)
  afmt: string; // Answer format (back template)
  bqfmt?: string; // Browser question format
  bafmt?: string; // Browser answer format
  did?: number; // Deck ID
  bfont?: string; // Browser font
  bsize?: number; // Browser font size
}

export interface AnkiNoteType {
  id: number;
  name: string;
  type: number; // 0 = standard, 1 = cloze
  mod: number; // Modification time
  usn: number; // Update sequence number
  sortf: number; // Sort field
  did?: number; // Default deck ID
  tmpls: AnkiCardType[]; // Card types/templates
  flds: AnkiField[]; // Fields
  css: string; // Styling
  tags: string[];
  config?: {
    [key: string]: any;
  };
}

export interface PreviewData {
  [fieldName: string]: string;
}

export interface TemplateProject {
  id: string;
  name: string;
  description: string;
  baseType: NoteBaseType;
  noteType: AnkiNoteType;
  previewData: PreviewData;
  createdAt: string;
  updatedAt: string;
  isShared: boolean;
  isDefault?: boolean;
  ownerName?: string;
  tags: string[];
}
