import styles from './AboutPage.module.css';
import sharedStyles from '../../styles/shared.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>About 2anki.net</h1>
        <p className={styles.heroSubtitle}>
          Making Anki flashcards easier, better, and faster
        </p>
      </div>

      <div className={styles.cardDark}>
        <h2>What is 2anki?</h2>
        <p>
          2anki.net is a open source micro saas which takes Notion notes and
          converts them to Anki flashcards. This project is used by autodidacts,
          students and professionals around the world.
        </p>
        <p>Fast, simple, easy and open source!</p>
        <div className={styles.textCenter}>
          <a href="/upload" className={styles.ctaButton}>
            Get Started
          </a>
        </div>
        <p className={sharedStyles.marginTopMd}>
          The goal of the 2anki.net project is to provide a good way to make{' '}
          <a href="https://apps.ankiweb.net/" target="_blank" rel="noreferrer">
            Anki
          </a>{' '}
          flashcards easier, better and faster. The dream is to have powerful
          and easy ways to produce high quality flashcards. This project is a
          complement to Anki and Notion.
        </p>
      </div>

      <div className={styles.grid2}>
        <div className={styles.cardDark}>
          <h2>What We Are Not</h2>
          <p>
            If you are looking for an Anki or Notion replacement then this
            project is probably not right for you. We are never going to compete
            against Anki in this project. We are building bridges
          </p>
          <p>
            When that is said, if you are not content with Anki, you might want
            to checkout{' '}
            <a
              href="https://www.super-memory.com/"
              target="_blank"
              rel="noreferrer"
            >
              SuperMemo
            </a>.
          </p>
        </div>

        <div className={styles.cardDark}>
          <h2>Benefits</h2>
          <ul>
            <li>
              No technical skills required and free to use by anyone anywhere 🤗
            </li>
            <li>Convert your Notion toggle lists to Anki cards easily</li>
            <li>Support for embeds, audio files, images and more</li>
          </ul>
          <p className={styles.smallText}>
            * Please note that due to server costs, there are quota limits in
            place but you can workaround this and self-host
          </p>
        </div>
      </div>

      <div className={styles.cardDark}>
        <h2>How it works</h2>
        <p>
          Check out our{' '}
          <a
            href="https://docs.2anki.net/guides/getting-started/"
            target="_blank"
            rel="noreferrer"
          >
            detailed guide
          </a>{' '}
          or follow these simple steps:
        </p>
        <ol>
          <li>Create toggle lists in Notion</li>
          <li>Export and upload to 2anki.net</li>
          <li>Download and import into Anki</li>
        </ol>
        <div className={sharedStyles.marginTopXl}>
          <p>
            We treat toggle lists on the top level as Anki flashcards. The
            toggle list line is the front of the card and everything inside in
            the details is the back. That&apos;s the main feature but you can
            customize the behaviour via card options.
          </p>
          <p>
            Considering how powerful{' '}
            <a
              href="https://docs.ankiweb.net/#/editing?id=cloze-deletion"
              target="_blank"
              rel="noreferrer"
            >
              cloze deletions
            </a>{' '}
            are, they are enabled by default.
          </p>
        </div>
      </div>
    </div>
  );
}
