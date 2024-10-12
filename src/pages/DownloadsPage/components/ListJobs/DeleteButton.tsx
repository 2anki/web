interface Prop {
  onDelete: () => void;
}

export function DeleteButton({ onDelete }: Prop) {
  return (
    <button
      aria-label="delete"
      type="button"
      className="is-small button transparent"
      onClick={() => onDelete()}
    >
      ❌
    </button>
  );
}
