/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { SettingsPayload } from '../../../lib/types';

import FontSizePicker from '../../FontSizePicker';
import LocalCheckbox from '../../LocalCheckbox';
import TemplateName from '../../TemplateName';
import TemplateSelect from '../../TemplateSelect';
import { saveValueInLocalStorage } from '../../../lib/data_layer/saveValueInLocalStorage';
import { ErrorHandlerType } from '../../errors/helpers/getErrorMessage';
import { clearStoredCardOptions } from '../../../lib/data_layer/clearStoredCardOptions';
import { availableTemplates } from './constants';
import { getLocalStorageValue } from '../../../lib/data_layer/getLocalStorageValue';
import { sendError } from '../../../lib/SendError';
import { get2ankiApi } from '../../../lib/backend/get2ankiApi';
import modalStyles from './SettingsModal.module.css';

import { getLocalStorageBooleanValue } from '../../../lib/data_layer/getLocalStorageBooleanValue';
import CardOption from '../../../lib/data_layer/model/CardOption';
import { getVisibleText } from '../../../lib/text/getVisibleText';
import { useSettingsCardsOptions } from './useSettingsCardsOptions';
import sharedStyles from '../../../styles/shared.module.css';

interface Props {
  pageTitle?: string;
  pageId: string | null;
  isActive: boolean;
  onClickClose: (event?: SyntheticEvent) => void;
  setError: ErrorHandlerType;
}

function SettingsModal({
  pageTitle,
  pageId,
  isActive,
  onClickClose,
  setError,
}: Readonly<Props>) {
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
    onClickClose();
  };

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!pageId) {
      onClickClose(event);
      return;
    }
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

    const newSettings = { object_id: pageId, payload };
    await get2ankiApi()
      .saveSettings(newSettings)
      .then(() => onClickClose(event))
      .catch((error) => setError(error));
  };

  return (
    <div className={isActive ? sharedStyles.modal : sharedStyles.modalHidden}>
      <div
        className={sharedStyles.modalBackdrop}
        onClick={onClickClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape')
            onClickClose(e as unknown as React.MouseEvent);
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />
      <div className={sharedStyles.modalCard}>
        {(loading || isLoading) && (
          <div
            className={`${sharedStyles.spinner} ${sharedStyles.marginTopLg}`}
          />
        )}
        {!loading && (
          <>
            <div className={sharedStyles.modalHeader}>
              <div className={sharedStyles.modalHeaderTitle}>
                {getVisibleText('card.options')}
              </div>
              <button
                type="button"
                aria-label="close"
                onClick={onClickClose}
                className={sharedStyles.modalClose}
              >
                &times;
              </button>
            </div>
            <section className={sharedStyles.modalBody}>
              <div className={modalStyles.section}>
                <label htmlFor="deck-name" className={modalStyles.sectionLabel}>
                  Deck Name
                </label>
                <p className={modalStyles.sectionHint}>
                  You can customize the deck name here. Leave it empty if you
                  use subpages.
                </p>
                <input
                  id="deck-name"
                  name="deck-name"
                  className={modalStyles.deckInput}
                  placeholder="Enter deck name (optional)"
                  value={deckName}
                  onChange={(e) => {
                    const newName = e.target.value;
                    if (newName !== deckName) setDeckName(newName);
                    saveValueInLocalStorage(deckNameKey, newName, pageId);
                  }}
                />
              </div>

              <div className={modalStyles.section}>
                <label
                  htmlFor="page-emoji"
                  className={modalStyles.sectionLabel}
                >
                  Page Icon
                </label>
                <p className={modalStyles.sectionHint}>
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

              <div className={modalStyles.section}>
                <label
                  htmlFor="toggle-mode"
                  className={modalStyles.sectionLabel}
                >
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

              <div className={modalStyles.section}>
                <details>
                  <summary className={modalStyles.detailsSummary}>
                    User Instructions for PDF conversion
                  </summary>
                  <textarea
                    className={modalStyles.instructionsTextarea}
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

              <div className={modalStyles.section}>
                <h2 className={modalStyles.templateHeading}>
                  Template Options
                </h2>
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
            </section>
            <footer className={sharedStyles.modalFooter}>
              <button
                type="button"
                className={sharedStyles.btnPrimary}
                onClick={onSubmit}
              >
                Save
              </button>
              <button
                type="button"
                className={sharedStyles.btnSecondary}
                onClick={resetStore}
              >
                Delete
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

SettingsModal.defaultProps = {
  pageTitle: null,
};

export default SettingsModal;
