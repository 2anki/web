export type ObjectIcon = {
  icon:
    { emoji: string; type?: "emoji" }
    | { external: { url: string }; type?: "external" }
    | null
}

export default function getObjectIcon(p?: ObjectIcon): string {
  switch (p?.icon?.type) {
    case "emoji": return p.icon.emoji;
    case "external": return p.icon.external.url;
    default:
      return "";
  }
}
