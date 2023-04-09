import { HomeContainer } from '../../components/styled';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import UploadForm from '../Upload/components/UploadForm';
import { ErrorHandlerType } from '../../components/errors/helpers/types';

interface Prop {
  setErrorMessage: ErrorHandlerType;
}

export default function HomePage({ setErrorMessage }: Prop) {
  return (
    <>
      <NavigationBar />
      <HomeContainer>
        <div className="section hero has-background-white">
          <div className="container">
            <h1 className="title">
              Revolutionize Your flashcard creation process with 2anki.net
            </h1>
            <p className="subtitle">
              Easily convert your notes into Anki flashcards fast using your own
              rules to define what a flashcard is.
            </p>
          </div>
        </div>
        <UploadForm setErrorMessage={setErrorMessage} />
        <div className="container">
          <div className="columns">
            <div className="column">
              <h3 className="title is-4">Open Source</h3>
              <p>
                2anki.net is a open source project and you can find the source
                code on <a href="https://github.com/2anki/2anki.net">GitHub</a>.
              </p>
            </div>
            <div className="column">
              <h3 className="title is-4">Trusted</h3>
              <p>
                2anki.net is used by autodidacts, doctors, dentists, students
                and professionals around the world.
              </p>
            </div>
            <div className="column">
              <h3 className="title is-4">Active development</h3>
              <p>
                2anki.net is continously being improved on. The Notion API
                integration is still in beta and there are lots of cool
                improvements in the works.
              </p>
            </div>
          </div>

          <img
            width="80%"
            src="/illustrations/illustrations-5.svg"
            alt="people all around the world"
          />
          <div className="columns section">
            <div className="column">
              <div className="card">
                <div className="card-content">
                  <div className="content">
                    <h3 className="title is-4">Anonymous</h3>
                    <p>No need for account to create decks up to 100MB.</p>
                    <p className="title">Free</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div className="card-content">
                  <div className="content">
                    <h3 className="title is-4">Registered</h3>
                    <p>One conversion job with the beta Notion integration.</p>
                    <p className="title">Free</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div className="card-content">
                  <div className="content">
                    <h3 className="title is-4">Patrons</h3>
                    <p>Unlimited number of parallel conversions.</p>
                    <p>
                      <a href="https://alemayhu.com/patreon">Subscribe</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HomeContainer>
    </>
  );
}
