interface TierInfoColumnProps {
  title: string;
  description: string;
  action?: {
    text: string;
    link: string;
  };
}

export function TierInfoColumn({ title, description, action }: Readonly<TierInfoColumnProps>) {
  return (
    <div
      className="tier-column one-third has-border-light box is-justify-content-space-around is-flex is-flex-direction-column mx-4">
      <h1 className="tier-title is-4">{title}</h1>
      <p>{description}</p>
      {action && <a className="is-text is-link" href={action.link}>{action.text}</a>}
      {!action && <p className="tier-title is-4">FREE</p>}
    </div>
  );
}
