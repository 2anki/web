interface ForgotPasswordProp {
  didReset: boolean;
  loading: boolean;
}

export function ForgotPassword({ didReset, loading }: ForgotPasswordProp) {
  if (didReset) {
    return <p>You should receive an email if your account exists.</p>;
  }

  return <div className="field">
    <div className="control" style={{ width: '100%' }}>
      <button
        type="submit"
        className="button is-link is-medium"
        style={{ width: '100%' }}
        disabled={loading}
      >
        Reset my password
      </button>
    </div>
  </div>;
}
