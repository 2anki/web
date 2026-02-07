interface TimeoutWarningProps {
  show: boolean;
}

export const TimeoutWarning = ({ show }: TimeoutWarningProps) => {
  if (!show) return null;

  return (
    <div className="notification is-warning">
      <p>
        <strong>Note:</strong> We're still processing your subscription
        activation. If you're already logged in, you can try visiting the{' '}
        <a href="/search">search page</a> directly, or refresh this page to
        check again.
      </p>
    </div>
  );
};
