import ObjectTitle from '../types/ObjectTitle';

export default function getObjectTitle(p: ObjectTitle): string {
  try {
    const { properties } = p;
    // Database
    if (p.object === 'database' && p.title) {
      return p.title.map((text) => text.plain_text).join('');
    }
    if (!properties) {
      return 'untitled';
    }
    if (properties.title) {
      return properties.title.title[0].plain_text;
    }
    if (properties.Name) {
      return properties.Name.title[0].plain_text;
    }

    const title = Object.keys(properties).find((k) => {
      const propValue = properties[k];
      if (propValue && Array.isArray(propValue)) {
        return properties[k].title[0].plain_text;
      }
      if (propValue && propValue.title) {
        return propValue.title[0].text.content;
      }
      return null;
    });
    if (title) {
      return title;
    }
  } catch (error) {
    return 'untitled';
  }
  return 'untitled';
}
