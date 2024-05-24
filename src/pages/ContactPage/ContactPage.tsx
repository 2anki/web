import React from 'react';

export function ContactPage() {
  return (
    <section className="section">
      <div className="container content">
        <h2 className="title is-2">Contact/Support</h2>
        <p>I’m here to help! If you have any questions, feedback, or need assistance, don’t hesitate to reach out.
        </p>

        <h3 className="title is-3">Main Developer</h3>
        <p>
          Hi, I’m Alexander Alemayhu, the main developer of this project. I’m always happy to hear from you and help out
          with any issues you might have.
        </p>
        <p>
          Email: <a href="mailto:alexander@alemayhu.com">alexander@alemayhu.com</a>
        </p>

        <h3 className="title is-3">How to Reach Us</h3>
        <p>To make things quicker and easier, please include the following in your email:</p>
        <ul>
          <li>Your name</li>
          <li>A brief description of your question or issue</li>
          <li>Steps to reproduce the issue (if it is a technical problem)</li>
          <li>Any screenshots or logs that might help</li>
        </ul>
        <p>We aim to get back to you within 24-48 hours. </p>
        <p>
          Thank you for being part of our community!
        </p>
      </div>
    </section>

  );
}
