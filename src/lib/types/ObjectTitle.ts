interface ObjectTitle {
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

export default ObjectTitle;
