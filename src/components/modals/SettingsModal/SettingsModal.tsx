import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { SettingsPayload } from '../../../lib/types';

import FontSizePicker from '../../FontSizePicker';
import LocalCheckbox from '../../LocalCheckbox';
import TemplateName from '../../TemplateName';
import TemplateSelect from '../../TemplateSelect';
import { saveValueInLocalStorage } from '../../../lib/data_layer/saveValueInLocalStorage';
import { ErrorHandlerType } from '../../errors/helpers/getErrorMessage';
import { clearStoredCardOptions } from '../../../lib/data_layer/clearStoredCardOptions';
import { availableTemplates, FIFTEEN_MINUTES } from './constants';
import { getLocalStorageValue } from '../../../lib/data_layer/getLocalStorageValue';
import { StyledInput } from './styled';
import { sendError } from '../../../lib/SendError';
import { get2ankiApi } from '../../../lib/backend/get2ankiApi';

import { getSettingsCardOptions } from '../../../lib/backend/getSettingsCardOptions';

import { getLocalStorageBooleanValue } from '../../../lib/data_layer/getLocalStorageBooleanValue';
import CardOption from '../../../lib/data_layer/model/CardOption';
import { getVisibleText } from '../../../lib/text/getVisibleText';
import { useSettingsCardsOptions } from './useSettingsCardsOptions';

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
                         setError
                       }: Props) {
  const { isLoading, isError, options, loadingDefaultsError } = useSettingsCardsOptions(pageId);
  const [settings, setSettings] = useState<SettingsPayload>({});
  const [loading, setLoading] = useState(!!pageId);
  const deckNameKey = 'deckName';
  const [deckName, setDeckName] = useState(
    getLocalStorageValue(
      deckNameKey,
      pageTitle || localStorage.getItem(deckNameKey) || '',
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

  useEffect(() => {
    if (pageId) {
      setLoading(true);
      get2ankiApi()
        .getSettings(pageId)
        .then((payload) => {
          if (payload) {
            if (payload.deckName) {
              setDeckName(payload.deckName);
            }
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


  if (isError) {
    setError(loadingDefaultsError);
  }

  const resetStore = async () => {
    if (pageId) {
      setDeckName(pageTitle || '');
      await get2ankiApi().deleteSettings(pageId);
    }
    if (options) {
      clearStoredCardOptions(options);
    }
    setFontSize('20');
    setToggleMode('close_toggle');
    setTemplate('specialstyle');
    setDeckName('');
    setBasicName('');
    setClozeName('');
    setInputName('');
    onClickClose();
  };

  const onSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!pageId) {
      onClickClose(event);
      return;
    }
    const payload: { [key: string]: string } = {};
    if (options) {
      options.forEach((option: CardOption) => {
        payload[option.key] = option.value.toString(); // use string for backwards compat
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
      .then(() => {
        onClickClose(event);
      })
      .catch((error) => {
        setError(error);
      });
  };


  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="modal-card">
        {(loading || isLoading) && <div className="loader is-loading" />}
        {!loading && (
          <>
            <div className="modal-card-head">
              <div className="modal-card-title">{getVisibleText('card.options')}</div>
              <button
                type="button"
                className="delete"
                aria-label="close"
                onClick={onClickClose}
              />
            </div>
            <section className="modal-card-body">
              <div className="container">
                <div className="field">
                  <strong>Deck Name</strong>
                  <p className="is-size-7">
                    You can use this to change the default name which comes from
                    the Notion page. If you have an existing deck in Anki you
                    want to update then you can also set the name here. It works
                    like Anki so you can create groupings (Parent::Child).
                    Please don&apos;t change the deck name if you have subpages,
                    it&apos;s more reliable to leave this empty if you have
                    subpages.
                  </p>
                  <div className="control">
                    <StyledInput
                      className="input"
                      placeholder="Enter deck name (optional)"
                      value={deckName}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const newName = event.target.value;
                        if (newName !== deckName) {
                          setDeckName(newName);
                        }
                        saveValueInLocalStorage(deckNameKey, newName, pageId);
                      }}
                    />
                  </div>
                  <div className="control">
                    <strong>Page icon</strong>
                    <p className="is-size-7">
                      By default the icon is the Notion page icon. You can
                      disable this for example when sorting gets messed up.
                    </p>
                    <TemplateSelect
                      values={[
                        { label: 'Icon first', value: 'first_emoji' },
                        {
                          label: 'Icon last',
                          value: 'last_emoji'
                        },
                        {
                          label: 'Disable icon',
                          value: 'disable_emoji'
                        }
                      ]}
                      value={pageEmoji}
                      name="page-emoji"
                      pickedTemplate={(t) => {
                        setPageEmoji(t);
                        saveValueInLocalStorage('page-emoji', t, pageId);
                      }}
                    />
                  </div>
                </div>
                <div className="container">
                  <strong>Toggle Mode</strong>
                  <p className="is-size-7">
                    If you use nested toggles in your flashcards then this
                    option is useful in the case where you want to collapse
                    them so you can open them manually when you want in Anki.
                  </p>
                  <TemplateSelect
                    values={[
                      { label: 'Open nested toggles', value: 'open_toggle' },
                      {
                        label: 'Close nested toggles',
                        value: 'close_toggle'
                      }
                    ]}
                    value={toggleMode}
                    name="toggle-mode"
                    pickedTemplate={(t) => {
                      setToggleMode(t);
                      saveValueInLocalStorage('toggle-mode', t, pageId);
                    }}
                  />
                  {options && options.map((o: CardOption) => <LocalCheckbox
                    key={o.key}
                    defaultValue={
                      getLocalStorageBooleanValue(
                        o.key, o.value.toString(), settings)
                    }
                    label={o.label}
                    description={o.description}
                    onChecked={(checked) => {
                      saveValueInLocalStorage(o.key, checked.toString(), pageId);
                    }}
                  />)}
                </div>
                <h2 className="title is-4">Template Options</h2>
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

                <FontSizePicker
                  fontSize={fontSize}
                  pickedFontSize={(fs) => {
                    setFontSize(fs);
                    saveValueInLocalStorage('font-size', fs.toString(), pageId);
                  }}
                />

                <hr />
              </div>
            </section>
            <div className="modal-card-foot is-justify-content-center">
              <button
                type="button"
                className="button is-link"
                onClick={onSubmit}
              >
                Save
              </button>
              <button
                type="button"
                className="button"
                onClick={() => resetStore()}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

SettingsModal.defaultProps = {
  pageTitle: null
};

export default SettingsModal;
