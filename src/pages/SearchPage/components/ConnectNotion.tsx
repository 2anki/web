interface Props {
  ready: boolean;
  connectionLink: string;
}

export default function ConnectNotion({ ready, connectionLink }: Props) {
  if (!ready) return null;

  return (
    <div
      style={{
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
      className="column is-half is-centered"
    >
      <a
        className="button is-link has-text-weight-semibold"
        href={connectionLink}
      >
        Connect to Notion
      </a>
    </div>
  );
}
