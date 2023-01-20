import React from 'react';

export function DeleteAllButton() {
  const [isDeletingAll, setIsDeletingAll] = React.useState(false);

  return (
    <button
      type="button"
      title="Delete all"
      className={`button is-flex is-small ${isDeletingAll ? 'is-loading' : ''} `}
      onClick={() => {
        setIsDeletingAll(true);
      }}
    >
      Delete everything
      <span className="tag is-black"><i className="fa-solid fa-trash" /></span>
    </button>
  );
}
