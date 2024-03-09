import { CreatedDeck } from './SimpleUploadForm';

interface CreatedDecksListProps {
  decks: CreatedDeck[];
}

const styles: React.CSSProperties = {
  padding: '1rem',
  border: '1px solid lightblue',
  marginTop: '1rem',
  borderRadius: '12px',
  background: '#e9e9ed',
  maxHeight: '320px',
  overflowY: 'scroll',
  scrollbarWidth: 'none',
};

const styleLink = {
  color: 'black',
  borderBottom: '1px solid grey',
  'li:lastChild': {
    borderBottom: 'none',
  },
};

const parentStyle = {
  overflow: 'hidden',
};

export function CreatedDecksList({ decks }: Readonly<CreatedDecksListProps>) {
  const isLastItem = (index: number) => index === decks.length - 1;

  if (decks.length === 0) {
    return null;
  }

  return (
    <div style={parentStyle}>
      <ul style={styles}>
        {decks.map((deck, index) => (
          <li style={!isLastItem(index) ? styleLink : {}} key={deck.link}>
            <a href={`${deck.link}`}>{deck.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
