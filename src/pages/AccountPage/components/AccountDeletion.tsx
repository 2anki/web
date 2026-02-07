import React from 'react';

export function AccountDeletion() {
  return (
    <div className="mt-6">
      <h4 className="title is-6 has-text-danger">Delete Account</h4>
      <div className="notification is-danger is-light">
        <p className="mb-2">
          <strong>Warning:</strong> Deleting your account will permanently
          remove all your data and cannot be undone.
        </p>
      </div>
      <a
        href="/delete-account"
        className="button is-danger is-outlined"
        onClick={(e) => {
          if (
            !confirm(
              'Are you sure you want to delete your account? This action cannot be undone.'
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        Delete Account
      </a>
    </div>
  );
}
