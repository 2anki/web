import React from 'react';

function NotFoundPage() {
  return (
    <section className="section is-fullheight">
      <div className="container is-fullwidth">
        <div className="columns is-centered">
          <div className="column is-half">
            <svg
              width="128"
              height="128"
              viewBox="0 0 128 128"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M64 16C35.8 16 16 35.8 16 64C16 92.2 35.8 112 64 112C92.2 112 112 92.2 112 64C112 35.8 92.2 16 64 16ZM64 104C52.3 104 42.6 94.3 42.6 82.6C42.6 70.9 52.3 61.2 64 61.2C75.7 61.2 85.4 70.9 85.4 82.6C85.4 94.3 75.7 104 64 104Z"
                fill="#FF0000"
              />
              <path d="M72 40H56V72H72V40Z" fill="#FF0000" />
            </svg>
            <h1 className="title is-1 has-text-centered">
              404 - Page Not Found
            </h1>
            <p className="subtitle is-4 has-text-centered">
              Oops! Looks like you&apos;ve wandered off the map.
            </p>
            <p className="has-text-centered">
              <a href="/" className="is-info">
                Take Me Home
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
