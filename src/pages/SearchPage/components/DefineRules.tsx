import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import Switch from '../../../components/input/Switch';
import SettingsModal from '../../../components/modals/SettingsModal/SettingsModal';
import TemplateSelect from '../../../components/TemplateSelect';
import NotionObject from '../../../lib/interfaces/NotionObject';
import { NewRule } from '../types';
import RuleDefinition from './RuleDefinition';
import { Details } from './styled';
import { ErrorHandlerType } from '../../../components/errors/helpers/getErrorMessage';
import { get2ankiApi } from '../../../lib/backend/get2ankiApi';
import styles from '../../../styles/shared.module.css';

interface Props {
  id: string;
  setDone: () => void;
  parent: string;
  isFavorite: boolean | undefined;
  setFavorites: Dispatch<SetStateAction<NotionObject[]>>;
  setError: ErrorHandlerType;
  type: string | null;
}

const flashCardOptions = [
  'toggle',
  'bulleted_list_item',
  'numbered_list_item',
  'heading_1',
  'heading_2',
  'heading_3',
  'column_list',
  'quote',
];
const tagOptions = ['heading', 'strikethrough'];
const subDeckOptions = ['child_page', 'child_database', ...flashCardOptions];
const deckOptions = ['page', 'database', ...subDeckOptions];

function DefineRules(props: Props) {
  const { type, id, setDone, parent, isFavorite, setFavorites, setError } =
    props;
  const [rules, setRules] = useState<NewRule>({
    id: 0,
    owner: 0,
    object_id: '',
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

  // TODO: refactor into own hook
  useEffect(() => {
    get2ankiApi()
      .getRules(id)
      .then((rule) => {
        if (rule) {
          const newRules: NewRule = {
            ...rule,
            flashcard_is: rule.flashcard_is.split(','),
            sub_deck_is: rule.sub_deck_is.split(','),
            deck_is: rule.deck_is.split(','),
          };
          setRules(newRules);
          setSendEmail(newRules.email_notification);
        }
        setIsloading(false);
      })
      .catch((error) => {
        setError(error);
      });
  }, [id]);

  const saveRules = async (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }
    setIsloading(true);

    try {
      await get2ankiApi().saveRules(
        id,
        rules.flashcard_is,
        rules.deck_is,
        rules.sub_deck_is,
        tags,
        sendEmail
      );
      setDone();
    } catch (error) {
      setError(error);
    }
  };

  const onSelectedFlashcardTypes = (fco: string) => {
    const included = rules.flashcard_is.includes(fco);
    if (!included) {
      rules.flashcard_is.push(fco);
    } else if (included) {
      rules.flashcard_is = rules.flashcard_is.filter((f) => f !== fco);
    }
    setFlashcard((prevState) =>
      Array.from(new Set([...prevState, ...rules.flashcard_is]))
    );
  };

  const onSelectedSubDeckTypes = (fco: string) => {
    const included = rules.sub_deck_is.includes(fco);
    if (!included) {
      rules.sub_deck_is.push(fco);
    } else {
      rules.sub_deck_is = rules.sub_deck_is.filter((f) => f !== fco);
    }
    setSubDeck((prevState) =>
      Array.from(new Set([...prevState, ...rules.sub_deck_is]))
    );
  };

  const onSelectedDeckTypes = (fco: string) => {
    const included = rules.deck_is.includes(fco);
    if (!included) {
      rules.deck_is.push(fco);
    } else {
      rules.deck_is = rules.deck_is.filter((f) => f !== fco);
    }
    setDeck((prevState) =>
      Array.from(new Set([...prevState, ...rules.deck_is]))
    );
  };

  const toggleFavorite = async () => {
    if (favorite) {
      await get2ankiApi().deleteFavorite(id);
    } else {
      await get2ankiApi().addFavorite(id, type);
    }
    const favorites = await get2ankiApi().getFavorites();
    setFavorites(favorites);
    setFavorite(!favorite);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalBackdrop} />
      <div className={styles.modalCardNarrow}>
        <header className={styles.modalHeader}>
          <p data-hj-suppress className={styles.modalRuleTitle}>
            Rules for {parent}
          </p>
          {isLoading && (
            <div aria-label="loading" className={styles.spinnerSmall} />
          )}
          <button
            onClick={() => setDone()}
            aria-label="close"
            type="button"
            className={styles.modalClose}
          >
            &times;
          </button>
        </header>
        {!isLoading && (
          <>
            {more && (
              <SettingsModal
                setError={setError}
                pageId={id}
                pageTitle={parent}
                isActive={more}
                onClickClose={() => {
                  setMore(false);
                }}
              />
            )}
            <div className={styles.modalBody}>
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
              <Details>
                <summary>Miscellaneous</summary>
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
                  checked={favorite || false}
                  onSwitched={toggleFavorite}
                />
              </Details>
              <div className={styles.textCenter}>
                <button
                  type="button"
                  className={styles.btnSmall}
                  onClick={() => setMore(!more)}
                >
                  More options
                </button>
              </div>
            </div>
            <footer className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setDone()}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                style={{ width: 'auto' }}
                onClick={(event) => saveRules(event)}
              >
                Save
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default DefineRules;
