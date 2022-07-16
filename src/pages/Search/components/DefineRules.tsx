import { Accordion, AccordionItem } from '@fremtind/jkl-accordion-react';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import Switch from '../../../components/input/Switch';
import SettingsModal from '../../../components/modals/SettingsModal';
import TemplateSelect from '../../../components/TemplateSelect';
import Backend from '../../../lib/Backend';
import NotionObject from '../../../lib/interfaces/NotionObject';
import StoreContext from '../../../store/StoreContext';
import RuleDefinition from './RuleDefinition';

interface Props {
  type: string;
  id: string;
  setDone: () => void;
  parent: string;
  isFavorite: boolean;
  setFavorites: Dispatch<SetStateAction<NotionObject[]>>;
}

const flashCardOptions = [
  'toggle',
  'bulleted_list_item',
  'numbered_list_item',
  'heading_1',
  'heading_2',
  'heading_3',
  'column_list',
];
const tagOptions = ['heading', 'strikethrough'];
const subDeckOptions = ['child_page', ...flashCardOptions];
const deckOptions = ['page', 'database', ...subDeckOptions];

const backend = new Backend();
function DefineRules(props: Props) {
  const {
    type, id, setDone, parent, isFavorite, setFavorites,
  } = props;
  const [rules, setRules] = useState({
    flashcard_is: ['toggle'],
    sub_deck_is: ['child_page'],
    tags_is: 'strikethrough',
    deck_is: ['page', 'database'],
    email_notification: false,
  });

  const [isLoading, setIsloading] = useState(true);
  const [, setFlashcard] = useState(rules.flashcard_is);
  const [, setSubDeck] = useState(rules.sub_deck_is);
  const [, setDeck] = useState(rules.deck_is);
  const [tags, setTags] = useState(rules.tags_is);
  const [sendEmail, setSendEmail] = useState(rules.email_notification);
  const [more, setMore] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const store = useContext(StoreContext);

  useEffect(() => {
    backend
      .getRules(id)
      .then((response) => {
        if (response.data) {
          const newRules = response.data;
          newRules.flashcard_is = newRules.flashcard_is.split(',');
          newRules.sub_deck_is = newRules.sub_deck_is.split(',');
          newRules.deck_is = newRules.deck_is.split(',');
          setRules(newRules);
          setSendEmail(newRules.email_notification);
        }
        setIsloading(false);
      })
      .catch((error) => {
        store.error = error;
      });
  }, [id]);

  const saveRules = async (event) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }
    setIsloading(true);

    try {
      await backend.saveRules(
        id,
        rules.flashcard_is,
        rules.deck_is,
        rules.sub_deck_is,
        tags,
        sendEmail,
      );
      setDone();
    } catch (error) {
      store.error = error;
    }
  };

  const onSelectedFlashcardTypes = (fco: string) => {
    const included = rules.flashcard_is.includes(fco);
    if (!included) {
      rules.flashcard_is.push(fco);
    } else if (included) {
      rules.flashcard_is = rules.flashcard_is.filter((f) => f !== fco);
    }
    setFlashcard((prevState) => Array.from(new Set([...prevState, ...rules.flashcard_is])));
  };

  const onSelectedSubDeckTypes = (fco: string) => {
    const included = rules.sub_deck_is.includes(fco);
    if (!included) {
      rules.sub_deck_is.push(fco);
    } else {
      rules.sub_deck_is = rules.sub_deck_is.filter((f) => f !== fco);
    }
    setSubDeck((prevState) => Array.from(new Set([...prevState, ...rules.sub_deck_is])));
  };

  const onSelectedDeckTypes = (fco: string) => {
    const included = rules.deck_is.includes(fco);
    if (!included) {
      rules.deck_is.push(fco);
    } else {
      rules.deck_is = rules.deck_is.filter((f) => f !== fco);
    }
    setDeck((prevState) => Array.from(new Set([...prevState, ...rules.deck_is])));
  };

  const toggleFavorite = async () => {
    if (favorite) {
      await backend.deleteFavorite(id);
    } else {
      await backend.addFavorite(id, type);
    }
    const favorites = await backend.getFavorites();
    setFavorites(favorites);
    setFavorite(!favorite);
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="modal-card">
        <div className="card" style={{ maxWidth: '480px' }}>
          <header className="card-header">
            <p className="card-header-title">
              Settings for
              {' '}
              {parent}
            </p>
            {isLoading && (
              <button
                aria-label="loading"
                type="button"
                className="m-2 card-header-icon button is-loading"
              />
            )}
            <div className="card-header-icon">
              <button
                onClick={() => setDone()}
                aria-label="delete"
                type="button"
                className="delete"
              />
            </div>
          </header>
          {!isLoading && (
            <>
              {more && (
                <SettingsModal
                  pageId={id}
                  pageTitle={parent}
                  isActive={more}
                  onClickClose={() => {
                    setMore(false);
                  }}
                />
              )}
              <Accordion data-theme="light">
                <RuleDefinition
                  title="What is a deck?"
                  description="This will be the first ones you see in the deck overview in Anki."
                  value={rules.deck_is}
                  options={deckOptions}
                  onSelected={onSelectedDeckTypes}
                />
                <RuleDefinition
                  title="What is a sub deck?"
                  description="These decks will be grouped under the decks above it."
                  value={rules.sub_deck_is}
                  options={subDeckOptions}
                  onSelected={onSelectedSubDeckTypes}
                />
                <RuleDefinition
                  title="What is a flashcard?"
                  description="Select the block types to create flashcards from."
                  value={rules.flashcard_is}
                  options={flashCardOptions}
                  onSelected={onSelectedFlashcardTypes}
                />
                <AccordionItem title="Miscellaneous">
                  <TemplateSelect
                    data-hj-suppress
                    pickedTemplate={(name: string) => setTags(name)}
                    values={tagOptions.map((fco) => ({
                      label: `Tags are ${fco}`,
                      value: fco,
                    }))}
                    name="Tags"
                    value={rules.tags_is}
                  />
                  <Switch
                    key="email-notification"
                    id="email-notification"
                    title="Receive email notifications when deck(s) are ready"
                    checked={sendEmail}
                    onSwitched={() => {
                      rules.email_notification = !rules.email_notification;
                      setSendEmail(rules.email_notification);
                    }}
                  />
                  <Switch
                    key="is-favorite"
                    id="is-favorite"
                    title="Mark this as a favorite"
                    checked={favorite}
                    onSwitched={toggleFavorite}
                  />
                </AccordionItem>
                <div className="has-text-centered">
                  <hr />
                  <button
                    type="button"
                    className="button is-small"
                    onClick={() => setMore(!more)}
                  >
                    More!
                  </button>
                </div>
              </Accordion>
              <footer className="card-footer">
                <a
                  href="/save-rules"
                  className="card-footer-item"
                  onClick={(event) => {
                    event.preventDefault();
                    saveRules(event);
                  }}
                >
                  Save
                </a>
                <a
                  href="/cancel-rules"
                  className="card-footer-item"
                  onClick={(event) => {
                    event.preventDefault();
                    setDone();
                  }}
                >
                  Cancel
                </a>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DefineRules;
