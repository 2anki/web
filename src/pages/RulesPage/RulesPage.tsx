import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Switch from '../../components/input/Switch';
import TemplateSelect from '../../components/TemplateSelect';
import RuleDefinition from '../SearchPage/components/RuleDefinition';
import { NewRule } from '../SearchPage/types';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';
import LoadingIndicator from '../../components/Loading';
import { CardOptionsForm } from '../../components/CardOptionsForm/CardOptionsForm';
import sharedStyles from '../../styles/shared.module.css';
import rulesStyles from '../SearchPage/components/Rules.module.css';
import styles from './RulesPage.module.css';

interface Props {
  setErrorMessage: ErrorHandlerType;
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

const defaultRules: NewRule = {
  id: 0,
  owner: 0,
  object_id: '',
  flashcard_is: ['toggle'],
  sub_deck_is: ['child_page'],
  tags_is: 'strikethrough',
  deck_is: ['page', 'database'],
  email_notification: false,
};

export default function RulesPage({ setErrorMessage }: Readonly<Props>) {
  const { id = '' } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const parent = params.get('title') ?? 'this page';
  const type = params.get('type');
  const returnTo = params.get('returnTo') ?? '/search';

  const [rules, setRules] = useState<NewRule>(defaultRules);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tags, setTags] = useState(defaultRules.tags_is);
  const [sendEmail, setSendEmail] = useState(defaultRules.email_notification);
  const [favorite, setFavorite] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([get2ankiApi().getRules(id), get2ankiApi().getFavorites()])
      .then(([rule, favorites]) => {
        if (cancelled) return;
        if (rule) {
          const next: NewRule = {
            ...rule,
            flashcard_is: rule.flashcard_is.split(','),
            sub_deck_is: rule.sub_deck_is.split(','),
            deck_is: rule.deck_is.split(','),
          };
          setRules(next);
          setSendEmail(next.email_notification);
          setTags(next.tags_is);
        }
        setFavorite(favorites.some((f) => f.id === id));
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error);
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const goBack = () => navigate(returnTo);

  const saveRules = async (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    try {
      await get2ankiApi().saveRules(
        id,
        rules.flashcard_is,
        rules.deck_is,
        rules.sub_deck_is,
        tags,
        sendEmail
      );
      goBack();
    } catch (error) {
      setErrorMessage(error);
      setIsSaving(false);
    }
  };

  const toggleSelection = (
    key: 'flashcard_is' | 'sub_deck_is' | 'deck_is',
    value: string
  ) => {
    setRules((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((f) => f !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const toggleFavorite = async () => {
    try {
      if (favorite) {
        await get2ankiApi().deleteFavorite(id);
      } else {
        await get2ankiApi().addFavorite(id, type);
      }
      setFavorite(!favorite);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  if (isLoading) {
    return (
      <div className={sharedStyles.page}>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className={sharedStyles.page}>
      <header className={sharedStyles.pageHeader}>
        <button type="button" onClick={goBack} className={styles.backLink}>
          ← Back
        </button>
        <h1 className={sharedStyles.title} data-hj-suppress>
          Rules for {parent}
        </h1>
        <p className={sharedStyles.subtitle}>
          Tell 2anki which Notion blocks should become decks, sub-decks, and
          flashcards.
        </p>
      </header>

      <div className={styles.card}>
        <RuleDefinition
          title="What is a deck?"
          description="This will be the first ones you see in the deck overview in Anki."
          value={rules.deck_is}
          options={deckOptions}
          onSelected={(fco) => toggleSelection('deck_is', fco)}
        />
        <RuleDefinition
          title="What is a sub deck?"
          description="These decks will be grouped under the decks above it."
          value={rules.sub_deck_is}
          options={subDeckOptions}
          onSelected={(fco) => toggleSelection('sub_deck_is', fco)}
        />
        <RuleDefinition
          title="What is a flashcard?"
          description="Select the block types to create flashcards from."
          value={rules.flashcard_is}
          options={flashCardOptions}
          onSelected={(fco) => toggleSelection('flashcard_is', fco)}
        />
        <details className={rulesStyles.details}>
          <summary>Miscellaneous</summary>
          <TemplateSelect
            data-hj-suppress
            pickedTemplate={(name: string) => setTags(name)}
            values={tagOptions.map((fco) => ({
              label: `Tags are ${fco}`,
              value: fco,
            }))}
            name="Tags"
            value={tags}
          />
          <Switch
            key="email-notification"
            id="email-notification"
            title="Receive email notifications when deck(s) are ready"
            checked={sendEmail}
            onSwitched={() => setSendEmail((prev) => !prev)}
          />
          <Switch
            key="is-favorite"
            id="is-favorite"
            title="Mark this as a favorite"
            checked={favorite}
            onSwitched={toggleFavorite}
          />
        </details>

        <footer className={styles.actions}>
          <button
            type="button"
            className={sharedStyles.btnPrimary}
            onClick={saveRules}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save rules'}
          </button>
          <button
            type="button"
            className={sharedStyles.btnSecondary}
            onClick={goBack}
          >
            Cancel
          </button>
        </footer>
      </div>

      <section className={styles.card}>
        <header className={styles.sectionHeader}>
          <h2 className={sharedStyles.subHeading}>Card options</h2>
          <p className={sharedStyles.subtitle}>
            Customize the deck name, templates, and conversion behavior for
            this page.
          </p>
        </header>
        <CardOptionsForm
          pageId={id}
          pageTitle={parent}
          onSaved={goBack}
          onReset={() => {
            /* stay on page after resetting */
          }}
          setError={setErrorMessage}
        />
      </section>
    </div>
  );
}
