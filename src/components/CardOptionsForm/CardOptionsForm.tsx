/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  SyntheticEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { SettingsPayload } from '../../lib/types';

import FontSizePicker from '../FontSizePicker';
import LocalCheckbox from '../LocalCheckbox';
import TemplateName from '../TemplateName';
import TemplateSelect from '../TemplateSelect';
import { saveValueInLocalStorage } from '../../lib/data_layer/saveValueInLocalStorage';
import { ErrorHandlerType } from '../errors/helpers/getErrorMessage';
import { clearStoredCardOptions } from '../../lib/data_layer/clearStoredCardOptions';
import { availableTemplates } from '../modals/SettingsModal/constants';
import { getLocalStorageValue } from '../../lib/data_layer/getLocalStorageValue';
import { sendError } from '../../lib/SendError';
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
}

export interface CardOptionsFormHandle {
  save: () => Promise<boolean>;
  reset: () => Promise<void>;
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
    }: Readonly<Props>,
    ref
  ) {
    const { isLoading, isError, options, loadingDefaultsError } =
      useSettingsCardsOptions(pageId);
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
    const [fontSize, setFontSize] = useState(
      getLocalStorageValue('font-size', '', settings)
    );
    const [template, setTemplate] = useState(
      getLocalStorageValue('template', 'specialstyle', settings)
    );
    const [toggleMode, setToggleMode] = useState(
      getLocalStorageValue('toggle-mode', 'close_toggle', settings)
    );
    const [pageEmoji, setPageEmoji] = useState(
      getLocalStorageValue('page-emoji', 'first_emoji', settings)
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
    const [userInstructions, setUserInstructions] = useState(
      getLocalStorageValue(
        'user-instructions',
        `Some extra rules and explanations:
- Read the document from start to finish and identify any question and answers.
- Use the same language as the document or infer the language based on what is mostly used.
- Use the same text as in the document and do not make up any questions or answers.
- Cite the document as source for the text.
- Be complete by finding all of the questions and answer in the document.
- Do not limit the number of number of questions and answer but create all of them!
- Do not make up any questions and use the questions in the document!
- Create a ul for every question pair, not one ul for all of them with li!`,
        settings
      )
    );

    useEffect(() => {
      if (pageId) {
        setLoading(true);
        get2ankiApi()
          .getSettings(pageId)
          .then((payload) => {
            if (payload) {
              if (payload.deckName) setDeckName(payload.deckName);
              setToggleMode(payload['toggle-mode']);
              setPageEmoji(payload['page-emoji']);
              setTemplate(payload.template);
              setSettings(payload);
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            setError(error);
          });
      }
    }, [pageId]);

    if (isError) setError(loadingDefaultsError);

    const resetStore = async () => {
      if (pageId) {
        setDeckName(pageTitle || '');
        await get2ankiApi().deleteSettings(pageId);
      } else {
        setDeckName('');
      }
      if (options) clearStoredCardOptions(options);
      setFontSize('20');
      setToggleMode('close_toggle');
      setTemplate('specialstyle');
      setDeckName('');
      setBasicName('');
      setClozeName('');
      setInputName('');
      onReset?.();
    };

    const serverSave = async (): Promise<boolean> => {
      if (!pageId) return true;
      const payload: { [key: string]: string } = {};
      if (options) {
        options.forEach((option: CardOption) => {
          payload[option.key] = option.value.toString();
        });
      } else {
        sendError(new Error('No options found'));
      }
      payload.deckName = deckName;
      payload['toggle-mode'] = toggleMode;
      payload.template = template;
      payload.basic_model_name = basicName;
      payload.cloze_model_name = clozeName;
      payload.input_model_name = inputName;
      payload['font-size'] = fontSize;
      payload['page-emoji'] = pageEmoji;

      try {
        await get2ankiApi().saveSettings({ object_id: pageId, payload });
        return true;
      } catch (error) {
        setError(error);
        return false;
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        save: serverSave,
        reset: resetStore,
      }),
      [serverSave, resetStore]
    );

    const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!pageId) {
        onSaved?.(event);
        return;
      }
      const ok = await serverSave();
      if (ok) onSaved?.(event);
    };

    if (loading || isLoading) {
      return (
        <div className={fieldStyles.loading}>
          <div className={sharedStyles.spinner} />
        </div>
      );
    }

    return (
      <div className={fieldStyles.form}>
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

        <div className={fieldStyles.section}>
          <label htmlFor="toggle-mode" className={fieldStyles.sectionLabel}>
            Toggle Mode
          </label>
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

        {options?.map((o) => (
          <LocalCheckbox
            key={o.key}
            defaultValue={getLocalStorageBooleanValue(
              o.key,
              o.value.toString(),
              settings
            )}
            label={o.label}
            description={o.description}
            onChecked={(checked) => {
              saveValueInLocalStorage(o.key, checked.toString(), pageId);
            }}
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

        <div className={fieldStyles.section}>
          <h3 className={fieldStyles.templateHeading}>Template Options</h3>
          <TemplateSelect
            values={availableTemplates}
            value={template}
            name="template"
            pickedTemplate={(t) => {
              setTemplate(t);
              saveValueInLocalStorage('template', t, pageId);
            }}
          />
          <TemplateName
            name="basic_model_name"
            value={basicName}
            placeholder="Defaults to n2a-basic"
            label="Basic Template Name"
            pickedName={(name) => {
              setBasicName(name);
              saveValueInLocalStorage('basic_model_name', name, pageId);
            }}
          />
          <TemplateName
            name="cloze_model_name"
            value={clozeName}
            placeholder="Defaults to n2a-cloze"
            label="Cloze Template Name"
            pickedName={(name) => {
              setClozeName(name);
              saveValueInLocalStorage('cloze_model_name', name, pageId);
            }}
          />
          <TemplateName
            name="input_model_name"
            value={inputName}
            placeholder="Defaults to n2a-input"
            label="Input Template Name"
            pickedName={(name) => {
              setInputName(name);
              saveValueInLocalStorage('input_model_name', name, pageId);
            }}
          />
        </div>

        <FontSizePicker
          fontSize={fontSize}
          pickedFontSize={(fs) => {
            setFontSize(fs);
            saveValueInLocalStorage('font-size', fs.toString(), pageId);
          }}
        />

        {!hideActions && (
          <div className={fieldStyles.actions}>
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
