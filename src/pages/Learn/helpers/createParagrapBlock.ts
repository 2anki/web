export const createParagraphBlock = (input: string) => ({
  has_children: false,
  archived: false,
  type: "paragraph",
  paragraph: {
    color: "blue_background",
    text: [
      {
        type: "text",
        text: {
          content: input
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: "default"
        }
      }
    ]
  }
});
