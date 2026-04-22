export enum NoteBaseType {
  Basic = "basic",
  BasicReversed = "basic-reversed",
  BasicOptionalReversed = "basic-optional-reversed",
  BasicTypeAnswer = "basic-type-answer",
  Cloze = "cloze",
  ImageOcclusion = "image-occlusion",
}

export const NOTE_BASE_TYPE_LABELS: Record<NoteBaseType, string> = {
  [NoteBaseType.Basic]: "Basic",
  [NoteBaseType.BasicReversed]: "Basic (and reversed card)",
  [NoteBaseType.BasicOptionalReversed]: "Basic (optional reversed card)",
  [NoteBaseType.BasicTypeAnswer]: "Basic (type in the answer)",
  [NoteBaseType.Cloze]: "Cloze",
  [NoteBaseType.ImageOcclusion]: "Image Occlusion",
};

export const NOTE_BASE_TYPE_DESCRIPTIONS: Record<NoteBaseType, string> = {
  [NoteBaseType.Basic]:
    'Has "Front" and "Back" fields, and will create one card.',
  [NoteBaseType.BasicReversed]:
    "Like Basic, but creates two cards: front→back and back→front.",
  [NoteBaseType.BasicOptionalReversed]:
    'Like Basic, but adds an "Add Reverse" field to optionally create a reversed card.',
  [NoteBaseType.BasicTypeAnswer]:
    "Like Basic, with a text box on the front to type your answer.",
  [NoteBaseType.Cloze]:
    "Allows you to select text and turn it into a cloze deletion.",
  [NoteBaseType.ImageOcclusion]:
    "Like Cloze, but works with images instead of text.",
};
