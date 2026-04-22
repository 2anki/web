import { useCallback, useEffect, useState } from "react";
// import MonacoEditor from "react-monaco-editor"; // Removed old react-monaco-editor
import { useCookies } from "react-cookie";
import * as _ from "lodash";

// Import monaco setup to configure workers and languages
import "../../monaco-setup";

// Import monaco-editor directly to access language registration
import * as monaco from "monaco-editor";

import TemplateSelect from "./components/TemplateSelect";
import { saveTemplates } from "./helpers/saveTemplates";
import fetchBaseType from "./helpers/fetchBaseType";
import { TemplateFile } from "./model/TemplateFile";
import { getUploadViewLink } from "./helpers/getUploadViewLink";

// Don't put in the render function, it gets recreated
let files: TemplateFile[] = [];

const ONE_SECOND_MS = 1000;

const options = {
  minimap: { enabled: false },
  colorDecorators: false,
  // Disable worker-dependent features to prevent "Unexpected usage" errors
  links: false,
  folding: false,
  foldingStrategy: "indentation" as const,
  // Keep syntax highlighting but disable advanced language features
  wordBasedSuggestions: false,
  suggest: {
    showWords: false,
    showSnippets: false,
  },
};

function TemplatePage() {
  const [token] = useCookies(["token"]);
  const [code, setCode] = useState("");
  const [isFront, setIsFront] = useState(true);
  const [isBack, setIsBack] = useState(false);
  const [isStyling, setIsStyling] = useState(false);
  const [language, setLanguage] = useState("html");

  const [currentCardType, setCurrentCardType] = useState(
    localStorage.getItem("current-card-type") || "n2a-basic"
  );
  const [ready, setReady] = useState(false);

  const editorDidMount = (
    editor: { focus: () => void },
    monacoInstance: any
  ) => {
    editor.focus();

    // Use the imported monaco if the instance isn't available
    const monacoToUse = monacoInstance || monaco;

    // Ensure language services are available
    if (monacoToUse && monacoToUse.languages) {
      // Force register HTML language
      if (
        !monacoToUse.languages
          .getLanguages()
          .some((lang: any) => lang.id === "html")
      ) {
        console.warn("HTML language not registered");
      }

      // Force register CSS language
      if (
        !monacoToUse.languages
          .getLanguages()
          .some((lang: any) => lang.id === "css")
      ) {
        console.warn("CSS language not registered");
      }

      console.log(
        "Available languages:",
        monacoToUse.languages.getLanguages().map((l: any) => l.id)
      );
    }
  };

  const getCurrentCardType = useCallback(
    () => files.find((x) => x.storageKey === currentCardType),
    [currentCardType]
  );

  const debounceSaveTemplate = _.debounce(
    () => saveTemplates(files),
    ONE_SECOND_MS
  );
  useEffect(() => debounceSaveTemplate.cancel(), [debounceSaveTemplate]);

  const onChange = (newValue: string) => {
    const card = getCurrentCardType();
    if (card) {
      if (isFront) {
        card.front = newValue;
      } else if (isBack) {
        card.back = newValue;
      } else if (isStyling) {
        card.styling = newValue;
      }
      localStorage.setItem(card.storageKey, JSON.stringify(card, null, 2));
      if (token) {
        debounceSaveTemplate();
      }
    }
  };

  const fetchTemplates = useCallback(async () => {
    files = [];
    const templateTypes = ["n2a-basic", "n2a-input", "n2a-cloze"];
    await Promise.all(
      templateTypes.map(async (name) => {
        const local = localStorage.getItem(name);
        if (local) {
          files.push(JSON.parse(local));
        } else {
          const remote = await fetchBaseType(name);
          files.push(remote);
          localStorage.setItem(name, JSON.stringify(remote, null, 2));
        }
      })
    );
    setReady(true);
    setLanguage("html");
    // Use the first basic front template as default file to load.
    // We might want to change this later to perserve last open file.
    setCode(files[0].front);
  }, []);

  // Fetch the base presets from the server  or load from local storage (should only be called once)
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Switching to front from back or styling
  useEffect(() => {
    if (isFront) {
      const card = getCurrentCardType();
      if (card) {
        setLanguage("html");
        setCode(card.front);
      }
      setIsStyling(false);
      setIsBack(false);
    }
  }, [isFront, currentCardType, getCurrentCardType]);

  // Switching to back from front or styling
  useEffect(() => {
    if (isBack) {
      const card = getCurrentCardType();
      if (card) {
        setCode(card.back);
        setLanguage("html");
      }
      setIsStyling(false);
      setIsFront(false);
    }
  }, [getCurrentCardType, isBack]);

  useEffect(() => {
    if (isStyling) {
      setIsFront(false);
      setIsBack(false);
      const c = getCurrentCardType();
      if (c) {
        setCode(c.styling);
        setLanguage("css");
      }
    }
  }, [getCurrentCardType, isStyling]);

  return (
    <section className="section mt4">
      <div className="container">
        {!ready && <p>Loading....</p>}
        {ready && (
          <>
            <p className="title">Template Manager</p>
            <hr />
            <p className="subtitle">
              No saving required, everything is saved instantly! You can always
              revert the template changes in the{" "}
              <a href={getUploadViewLink()}>settings</a>. Adding / removing
              fields and preview is coming soon.
            </p>
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <TemplateSelect
                    values={files.map((f) => ({
                      label: f.name,
                      value: f.name,
                    }))}
                    value={currentCardType}
                    name="current-card-type"
                    pickedTemplate={(t) => {
                      setIsFront(true);
                      setCurrentCardType(t);
                    }}
                  />
                </div>
              </div>
            </div>
            <p>Template</p>
            <div className="control m-2">
              <label htmlFor="front-template" className="radio">
                <input
                  checked={isFront}
                  onChange={(event) => setIsFront(event.target.checked)}
                  className="m-2"
                  type="radio"
                  name="front-template"
                />
                Front Template
              </label>
              <label htmlFor="back-template" className="radio">
                <input
                  checked={isBack}
                  onChange={(event) => setIsBack(event.target.checked)}
                  className="m-2"
                  type="radio"
                  name="back-template"
                />
                Back Template
              </label>
              <label htmlFor="styling" className="radio">
                <input
                  checked={isStyling}
                  onChange={(event) => setIsStyling(event.target.checked)}
                  className="m-2"
                  type="radio"
                  name="styling"
                />
                Styling
              </label>
            </div>
            {/* Temporarily commented out old MonacoEditor 
            <MonacoEditor
              height="512px"
              language={language}
              theme="vs-dark"
              value={code}
              options={options}
              onChange={onChange}
              editorDidMount={editorDidMount}
            />
            */}
            <div
              style={{
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <p>Legacy Template Editor - Temporarily disabled</p>
              <p>Use the new TemplateEditor component instead</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default TemplatePage;
