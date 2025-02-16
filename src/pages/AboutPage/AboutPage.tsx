import React from 'react';
import { PageContainer } from '../../components/styled';

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="content">
        <div className="hero">
          <div className="hero-body">
            <h1 className="title has-text-centered">About 2anki.net</h1>
            <p className="subtitle has-text-centered">
              Making Anki flashcards easier, better, and faster
            </p>
          </div>
        </div>

        <div className="columns is-centered">
          <div className="column is-8">
            <div className="box has-background-dark has-text-light mb-6">
              <h2 className="title is-4 has-text-light">What is 2anki?</h2>
              <p className="mb-4">
                2anki.net is a open source micro saas which takes Notion notes
                and converts them to Anki flashcards. This project is used by
                autodidacts, students and professionals around the world.
              </p>
              <p className="mb-4">Fast, simple, easy and open source!</p>
              <div className="has-text-centered">
                <a href="/upload" className="button is-primary is-medium">
                  Get Started
                </a>
              </div>
              <p className="my-4">
                The goal of the 2anki.net project is to provide a good way to
                make{' '}
                <a
                  href="https://apps.ankiweb.net/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Anki
                </a>{' '}
                flashcards easier, better and faster. The dream is to have
                powerful and easy ways to produce high quality flashcards. This
                project is a complement to Anki and Notion.
              </p>
            </div>

            <div className="columns is-multiline mt-5">
              <div className="column is-6">
                <div className="box has-background-dark has-text-light h-100">
                  <h2 className="title is-4">What We Are Not</h2>
                  <p>
                    If you are looking for an Anki or Notion replacement then
                    this project is probably not right for you. We are never
                    going to compete against Anki in this project. We are
                    building bridges
                  </p>
                  <p className="mt-4">
                    When that is said, if you are not content with Anki, you
                    might want to checkout{' '}
                    <a
                      href="https://www.super-memory.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      SuperMemo
                    </a>{' '}
                    .
                  </p>
                </div>
              </div>

              <div className="column is-6">
                <div className="box has-background-dark has-text-light h-100">
                  <h2 className="title is-4">Benefits</h2>
                  <ul className="ml-4">
                    <li className="mb-2">
                      No technical skills required and free to use by anyone
                      anywhere 🤗
                    </li>
                    <li className="mb-2">
                      Convert your Notion toggle lists to Anki cards easily
                    </li>
                    <li className="mb-2">
                      Support for embeds, audio files, images and more
                    </li>
                  </ul>
                  <p className="is-size-7 mt-4">
                    * Please note that due to server costs, there are quota
                    limits in place but you can workaround this and self-host
                  </p>
                </div>
              </div>
            </div>

            <div className="box has-background-dark has-text-light mt-5">
              <h2 className="title is-4">How it works</h2>
              <p className="mb-4">
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
              <ol className="ml-4">
                <li className="mb-2">Create toggle lists in Notion</li>
                <li className="mb-2">Export and upload to 2anki.net</li>
                <li className="mb-2">Download and import into Anki</li>
              </ol>
              <div className="mt-5">
                <p>
                  We treat toggle lists on the top level as Anki flashcards. The
                  toggle list line is the front of the card and everything
                  inside in the details is the back. That&apos;s the main
                  feature but you can customize the behaviour via card options.
                </p>
                <p className="mt-4">
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
        </div>
      </div>
    </PageContainer>
  );
}
