/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  SyntheticEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { SettingsPayload } from '../../lib/types';

import { Link } from 'react-router-dom';
import LocalCheckbox from '../LocalCheckbox';
import TemplateSelect from '../TemplateSelect';
import { CardStyleRow, DEFAULT_STYLE_ID } from './CardStyleRow';
import { useUserTemplates } from './useUserTemplates';
import { saveValueInLocalStorage } from '../../lib/data_layer/saveValueInLocalStorage';
import { ErrorHandlerType } from '../errors/helpers/getErrorMessage';
import { clearStoredCardOptions } from '../../lib/data_layer/clearStoredCardOptions';
import { getLocalStorageValue } from '../../lib/data_layer/getLocalStorageValue';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';
import { getLocalStorageBooleanValue } from '../../lib/data_layer/getLocalStorageBooleanValue';
import CardOption from '../../lib/data_layer/model/CardOption';
import { useSettingsCardsOptions } from '../modals/SettingsModal/useSettingsCardsOptions';
import fieldStyles from './CardOptionsForm.module.css';
import sharedStyles from '../../styles/shared.module.css';

interface Props {
  pageTitle?: string | null;
  pageId: string | null;
  onSaved?: (event?: SyntheticEvent) => void;
  onReset?: () => void;
  setError: ErrorHandlerType;
  hideActions?: boolean;
  layout?: 'stack' | 'grid';
}

export interface CardOptionsFormHandle {
  save: () => Promise<boolean>;
  reset: () => Promise<void>;
  isDirty: () => boolean;
}

const DEFAULT_TOGGLE_MODE = 'close_toggle';
const DEFAULT_PAGE_EMOJI = 'first_emoji';
const DEFAULT_USER_INSTRUCTIONS = `Some extra rules and explanations:
- Read the document from start to finish and identify any question and answers.
- Use the same language as the document or infer the language based on what is mostly used.
- Use the same text as in the document and do not make up any questions or answers.
- Cite the document as source for the text.
- Be complete by finding all of the questions and answer in the document.
- Do not limit the number of number of questions and answer but create all of them!
- Do not make up any questions and use the questions in the document!
- Create a ul for every question pair, not one ul for all of them with li!`;

function computeSnapshot(values: {
  deckName: string;
  toggleMode: string;
  pageEmoji: string;
  basicStyleId: string;
  clozeStyleId: string;
  inputStyleId: string;
  basicName: string;
  clozeName: string;
  inputName: string;
  userInstructions: string;
  checkboxValues: Record<string, boolean>;
}) {
  const sortedCheckboxes = Object.keys(values.checkboxValues)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => [key, values.checkboxValues[key]]);
  return JSON.stringify({ ...values, checkboxValues: sortedCheckboxes });
}

export const CardOptionsForm = forwardRef<CardOptionsFormHandle, Props>(
  function CardOptionsForm(
    {
      pageTitle,
      pageId,
      onSaved,
      onReset,
      setError,
      hideActions = false,
      layout = 'stack',
    }: Readonly<Props>,
    ref
  ) {
    const { isLoading, isError, options, loadingDefaultsError } =
      useSettingsCardsOptions(pageId);
    const userTemplates = useUserTemplates();
    const [settings, setSettings] = useState<SettingsPayload>({});
    const [loading, setLoading] = useState(!!pageId);
    const deckNameKey = 'deckName';
    const [deckName, setDeckName] = useState(
      getLocalStorageValue(
        deckNameKey,
        pageTitle ?? localStorage.getItem(deckNameKey) ?? '',
        settings
      )
    );
    const [toggleMode, setToggleMode] = useState(
      getLocalStorageValue('toggle-mode', DEFAULT_TOGGLE_MODE, settings)
    );
    const [pageEmoji, setPageEmoji] = useState(
      getLocalStorageValue('page-emoji', DEFAULT_PAGE_EMOJI, settings)
    );
    const [basicName, setBasicName] = useState(
      getLocalStorageValue('basic_model_name', '', settings)
    );
    const [clozeName, setClozeName] = useState(
      getLocalStorageValue('cloze_model_name', '', settings)
    );
    const [inputName, setInputName] = useState(
      getLocalStorageValue('input_model_name', '', settings)
    );
    const [basicStyleId, setBasicStyleId] = useState(
      getLocalStorageValue('basic_style_id', DEFAULT_STYLE_ID, settings)
    );
    const [clozeStyleId, setClozeStyleId] = useState(
      getLocalStorageValue('cloze_style_id', DEFAULT_STYLE_ID, settings)
    );
    const [inputStyleId, setInputStyleId] = useState(
      getLocalStorageValue('input_style_id', DEFAULT_STYLE_ID, settings)
    );
    const [basicNameIsCustom, setBasicNameIsCustom] = useState(
      getLocalStorageValue('basic_name_custom', '', settings) === 'true'
    );
    const [clozeNameIsCustom, setClozeNameIsCustom] = useState(
      getLocalStorageValue('cloze_name_custom', '', settings) === 'true'
    );
    const [inputNameIsCustom, setInputNameIsCustom] = useState(
      getLocalStorageValue('input_name_custom', '', settings) === 'true'
    );
    const [userInstructions, setUserInstructions] = useState(
      getLocalStorageValue(
        'user-instructions',
        DEFAULT_USER_INSTRUCTIONS,
        settings
      )
    );
    const [checkboxValues, setCheckboxValues] = useState<
      Record<string, boolean>
    >({});
    const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);

    // Seed checkbox state from options + settings when they load.
    useEffect(() => {
      if (!options) return;
      const next: Record<string, boolean> = {};
      options.forEach((o: CardOption) => {
        next[o.key] = getLocalStorageBooleanValue(
          o.key,
          o.value.toString(),
          settings
        );
      });
      setCheckboxValues(next);
    }, [options, settings]);

    // Hydrate every server-backed field when settings load. Use key-presence
    // checks so that a persisted empty string is applied (not skipped).
    useEffect(() => {
      if (!pageId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setInitialSnapshot(null);
      // Reset to the same defaults used for the first mount so switching
      // pageId doesn't carry over the previous page's values.
      setDeckName(pageTitle ?? localStorage.getItem(deckNameKey) ?? '');
      setToggleMode(localStorage.getItem('toggle-mode') ?? DEFAULT_TOGGLE_MODE);
      setPageEmoji(localStorage.getItem('page-emoji') ?? DEFAULT_PAGE_EMOJI);
      setBasicName(localStorage.getItem('basic_model_name') ?? '');
      setClozeName(localStorage.getItem('cloze_model_name') ?? '');
      setInputName(localStorage.getItem('input_model_name') ?? '');
      setBasicStyleId(
        localStorage.getItem('basic_style_id') ?? DEFAULT_STYLE_ID
      );
      setClozeStyleId(
        localStorage.getItem('cloze_style_id') ?? DEFAULT_STYLE_ID
      );
      setInputStyleId(
        localStorage.getItem('input_style_id') ?? DEFAULT_STYLE_ID
      );
      setBasicNameIsCustom(
        localStorage.getItem('basic_name_custom') === 'true'
      );
      setClozeNameIsCustom(
        localStorage.getItem('cloze_name_custom') === 'true'
      );
      setInputNameIsCustom(
        localStorage.getItem('input_name_custom') === 'true'
      );
      setUserInstructions(
        localStorage.getItem('user-instructions') ?? DEFAULT_USER_INSTRUCTIONS
      );
      setSettings({});

      const applyPayload = (payload: SettingsPayload) => {
        const assignments: Array<[string, (value: string) => void]> = [
          ['deckName', setDeckName],
          ['toggle-mode', setToggleMode],
          ['page-emoji', setPageEmoji],
          ['basic_model_name', setBasicName],
          ['cloze_model_name', setClozeName],
          ['input_model_name', setInputName],
          ['basic_style_id', setBasicStyleId],
          ['cloze_style_id', setClozeStyleId],
          ['input_style_id', setInputStyleId],
          ['user-instructions', setUserInstructions],
        ];
        assignments.forEach(([key, setter]) => {
          if (Object.hasOwn(payload, key)) {
            setter(payload[key] ?? '');
          }
        });
        setSettings(payload);
      };

      get2ankiApi()
        .getSettings(pageId)
        .then((payload) => {
          if (payload) applyPayload(payload);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
        });
    }, [pageId]);

    // Surface card-option loading errors without firing setError during render.
    useEffect(() => {
      if (isError && loadingDefaultsError) {
        setError(loadingDefaultsError);
      }
    }, [isError, loadingDefaultsError, setError]);

    const currentSnapshot = useMemo(
      () =>
        computeSnapshot({
          deckName,
          toggleMode,
          pageEmoji,
          basicStyleId,
          clozeStyleId,
          inputStyleId,
          basicName,
          clozeName,
          inputName,
          userInstructions,
          checkboxValues,
        }),
      [
        deckName,
        toggleMode,
        pageEmoji,
        basicStyleId,
        clozeStyleId,
        inputStyleId,
        basicName,
        clozeName,
        inputName,
        userInstructions,
        checkboxValues,
      ]
    );

    // Capture initial snapshot once fields and checkbox state are seeded.
    useEffect(() => {
      if (loading || isLoading) return;
      if (initialSnapshot !== null) return;
      const expectedCheckboxes = options?.length ?? 0;
      if (expectedCheckboxes > 0 && Object.keys(checkboxValues).length === 0)
        return;
      setInitialSnapshot(currentSnapshot);
    }, [
      loading,
      isLoading,
      initialSnapshot,
      options,
      checkboxValues,
      currentSnapshot,
    ]);

    const toggleCheckbox = (key: string, checked: boolean) => {
      setCheckboxValues((prev) => ({ ...prev, [key]: checked }));
      saveValueInLocalStorage(key, checked.toString(), pageId);
    };

    const resetStore = async () => {
      if (pageId) {
        await get2ankiApi().deleteSettings(pageId);
      }
      if (options) clearStoredCardOptions(options);
      localStorage.removeItem('page-emoji');
      localStorage.removeItem('user-instructions');
      localStorage.removeItem('basic_style_id');
      localStorage.removeItem('cloze_style_id');
      localStorage.removeItem('input_style_id');
      localStorage.removeItem('basic_name_custom');
      localStorage.removeItem('cloze_name_custom');
      localStorage.removeItem('input_name_custom');
      setDeckName('');
      setToggleMode(DEFAULT_TOGGLE_MODE);
      setPageEmoji(DEFAULT_PAGE_EMOJI);
      setBasicName('');
      setClozeName('');
      setInputName('');
      setBasicStyleId(DEFAULT_STYLE_ID);
      setClozeStyleId(DEFAULT_STYLE_ID);
      setInputStyleId(DEFAULT_STYLE_ID);
      setBasicNameIsCustom(false);
      setClozeNameIsCustom(false);
      setInputNameIsCustom(false);
      setUserInstructions(DEFAULT_USER_INSTRUCTIONS);
      if (options) {
        const reset: Record<string, boolean> = {};
        options.forEach((o: CardOption) => {
          reset[o.key] = false;
        });
        setCheckboxValues(reset);
      }
      setInitialSnapshot(null);
      onReset?.();
    };

    const serverSave = async (): Promise<boolean> => {
      if (!pageId) return true;
      const payload: { [key: string]: string } = {};
      Object.entries(checkboxValues).forEach(([key, value]) => {
        payload[key] = value.toString();
      });
      payload.deckName = deckName;
      payload['toggle-mode'] = toggleMode;
      payload.basic_model_name = basicName;
      payload.cloze_model_name = clozeName;
      payload.input_model_name = inputName;
      payload.basic_style_id = basicStyleId;
      payload.cloze_style_id = clozeStyleId;
      payload.input_style_id = inputStyleId;
      payload['page-emoji'] = pageEmoji;
      payload['user-instructions'] = userInstructions;

      try {
        await get2ankiApi().saveSettings({ object_id: pageId, payload });
        setInitialSnapshot(currentSnapshot);
        return true;
      } catch (error) {
        setError(error);
        return false;
      }
    };

    useImperativeHandle(ref, () => ({
      save: serverSave,
      reset: resetStore,
      isDirty: () =>
        initialSnapshot !== null && currentSnapshot !== initialSnapshot,
    }));

    const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!pageId) {
        onSaved?.(event);
        return;
      }
      const ok = await serverSave();
      if (ok) onSaved?.(event);
    };

    const checkboxesReady =
      !options ||
      options.length === 0 ||
      Object.keys(checkboxValues).length > 0;
    if (loading || isLoading || !checkboxesReady) {
      return (
        <div className={fieldStyles.loading}>
          <div className={sharedStyles.spinner} />
        </div>
      );
    }

    const formClassName =
      layout === 'grid' ? fieldStyles.formGrid : fieldStyles.form;

    return (
      <div className={formClassName}>
        <div className={fieldStyles.section}>
          <label htmlFor="deck-name" className={fieldStyles.sectionLabel}>
            Deck Name
          </label>
          <p className={fieldStyles.sectionHint}>
            You can customize the deck name here. Leave it empty if you use
            subpages.
          </p>
          <input
            id="deck-name"
            name="deck-name"
            className={fieldStyles.deckInput}
            placeholder="Enter deck name (optional)"
            value={deckName}
            onChange={(e) => {
              const newName = e.target.value;
              if (newName !== deckName) setDeckName(newName);
              saveValueInLocalStorage(deckNameKey, newName, pageId);
            }}
          />
        </div>

        <div className={fieldStyles.section}>
          <label htmlFor="page-emoji" className={fieldStyles.sectionLabel}>
            Page Icon
          </label>
          <p className={fieldStyles.sectionHint}>
            Control whether to use the Notion page icon and its position.
          </p>
          <TemplateSelect
            values={[
              { label: 'Icon first', value: 'first_emoji' },
              { label: 'Icon last', value: 'last_emoji' },
              { label: 'Disable icon', value: 'disable_emoji' },
            ]}
            value={pageEmoji}
            name="page-emoji"
            pickedTemplate={(t) => {
              setPageEmoji(t);
              saveValueInLocalStorage('page-emoji', t, pageId);
            }}
          />
        </div>

        <div className={`${fieldStyles.section} ${fieldStyles.fullRow}`}>
          <p className={fieldStyles.sectionHint}>
            <strong>How toggles become cards:</strong> each toggle&apos;s header
            is the front of a card, and its contents become the back. A toggle
            inside a toggle (nested toggle) becomes its own card using the
            rules below.
          </p>
        </div>

        <div className={fieldStyles.section}>
          <label htmlFor="toggle-mode" className={fieldStyles.sectionLabel}>
            Toggle Mode
          </label>
          <p className={fieldStyles.sectionHint}>
            Controls how nested toggles render on the back of a card.{' '}
            <em>Open nested toggles</em> shows their contents expanded;{' '}
            <em>Close nested toggles</em> keeps them collapsed so you can reveal
            them one at a time while reviewing.
          </p>
          <TemplateSelect
            values={[
              { label: 'Open nested toggles', value: 'open_toggle' },
              { label: 'Close nested toggles', value: 'close_toggle' },
            ]}
            value={toggleMode}
            name="toggle-mode"
            pickedTemplate={(t) => {
              setToggleMode(t);
              saveValueInLocalStorage('toggle-mode', t, pageId);
            }}
          />
        </div>

        {options?.map((o: CardOption) => (
          <LocalCheckbox
            key={o.key}
            defaultValue={checkboxValues[o.key] ?? false}
            label={o.label}
            description={o.description}
            onChecked={(checked) => toggleCheckbox(o.key, checked)}
          />
        ))}

        <div className={fieldStyles.section}>
          <details>
            <summary className={fieldStyles.detailsSummary}>
              User Instructions for PDF conversion
            </summary>
            <textarea
              className={fieldStyles.instructionsTextarea}
              value={userInstructions}
              onChange={(e) => {
                setUserInstructions(e.target.value);
                saveValueInLocalStorage(
                  'user-instructions',
                  e.target.value,
                  pageId
                );
              }}
              rows={4}
              placeholder="Instructions for PDF conversion..."
            />
          </details>
        </div>

        <div className={`${fieldStyles.section} ${fieldStyles.fullRow}`}>
          <div className={fieldStyles.templateHeadingRow}>
            <h3 className={fieldStyles.templateHeading}>Card styles</h3>
            <Link
              to="/templates"
              className={fieldStyles.editTemplatesLink}
              target="_blank"
              rel="noreferrer"
            >
              Edit card styles ↗
            </Link>
          </div>
          <CardStyleRow
            kind="basic"
            templates={userTemplates}
            styleId={basicStyleId}
            name={basicName}
            duplicateName={
              basicName !== '' &&
              (basicName === clozeName || basicName === inputName)
            }
            onStyleChange={(id, autoName) => {
              setBasicStyleId(id);
              saveValueInLocalStorage('basic_style_id', id, pageId);
              if (!basicNameIsCustom) {
                setBasicName(autoName);
                saveValueInLocalStorage('basic_model_name', autoName, pageId);
              }
            }}
            onNameChange={(name) => {
              setBasicName(name);
              setBasicNameIsCustom(true);
              saveValueInLocalStorage('basic_model_name', name, pageId);
              saveValueInLocalStorage(
                'basic_name_custom',
                'true',
                pageId
              );
            }}
          />
          <CardStyleRow
            kind="cloze"
            templates={userTemplates}
            styleId={clozeStyleId}
            name={clozeName}
            duplicateName={
              clozeName !== '' &&
              (clozeName === basicName || clozeName === inputName)
            }
            onStyleChange={(id, autoName) => {
              setClozeStyleId(id);
              saveValueInLocalStorage('cloze_style_id', id, pageId);
              if (!clozeNameIsCustom) {
                setClozeName(autoName);
                saveValueInLocalStorage('cloze_model_name', autoName, pageId);
              }
            }}
            onNameChange={(name) => {
              setClozeName(name);
              setClozeNameIsCustom(true);
              saveValueInLocalStorage('cloze_model_name', name, pageId);
              saveValueInLocalStorage(
                'cloze_name_custom',
                'true',
                pageId
              );
            }}
          />
          <CardStyleRow
            kind="input"
            templates={userTemplates}
            styleId={inputStyleId}
            name={inputName}
            duplicateName={
              inputName !== '' &&
              (inputName === basicName || inputName === clozeName)
            }
            onStyleChange={(id, autoName) => {
              setInputStyleId(id);
              saveValueInLocalStorage('input_style_id', id, pageId);
              if (!inputNameIsCustom) {
                setInputName(autoName);
                saveValueInLocalStorage('input_model_name', autoName, pageId);
              }
            }}
            onNameChange={(name) => {
              setInputName(name);
              setInputNameIsCustom(true);
              saveValueInLocalStorage('input_model_name', name, pageId);
              saveValueInLocalStorage(
                'input_name_custom',
                'true',
                pageId
              );
            }}
          />
        </div>

        {!hideActions && (
          <div className={`${fieldStyles.actions} ${fieldStyles.fullRow}`}>
            <button
              type="button"
              className={`${sharedStyles.btnPrimary} ${fieldStyles.actionButton}`}
              onClick={onSubmit}
            >
              Save card options
            </button>
            <button
              type="button"
              className={`${sharedStyles.btnSecondary} ${fieldStyles.actionButton}`}
              onClick={resetStore}
            >
              Reset to defaults
            </button>
          </div>
        )}
      </div>
    );
  }
);
