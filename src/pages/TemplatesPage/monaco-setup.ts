import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

// Configure Monaco loader
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs",
  },
});

// Set up Monaco environment for web workers
(window as any).MonacoEnvironment = {
  getWorker: function (workerId: string, label: string) {
    const getWorkerModule = (moduleUrl: string, fallback: () => Worker) => {
      try {
        return new Worker(new URL(moduleUrl, window.location.origin), {
          name: label,
          type: "module",
        });
      } catch (error) {
        console.warn("Failed to load worker module, using fallback:", error);
        return fallback();
      }
    };

    switch (label) {
      case "html":
        return getWorkerModule(
          "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/esm/vs/language/html/html.worker.js",
          () =>
            new Worker(
              "data:text/javascript;charset=utf-8," +
                encodeURIComponent(`
            importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/base/worker/workerMain.js');
          `)
            )
        );
      case "css":
        return getWorkerModule(
          "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/esm/vs/language/css/css.worker.js",
          () =>
            new Worker(
              "data:text/javascript;charset=utf-8," +
                encodeURIComponent(`
            importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/base/worker/workerMain.js');
          `)
            )
        );
      case "typescript":
      case "javascript":
        return getWorkerModule(
          "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/esm/vs/language/typescript/ts.worker.js",
          () =>
            new Worker(
              "data:text/javascript;charset=utf-8," +
                encodeURIComponent(`
            importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/base/worker/workerMain.js');
          `)
            )
        );
      default:
        return getWorkerModule(
          "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/esm/vs/editor/editor.worker.js",
          () =>
            new Worker(
              "data:text/javascript;charset=utf-8," +
                encodeURIComponent(`
            importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/base/worker/workerMain.js');
          `)
            )
        );
    }
  },
};

// Configure HTML language features for Anki template fields
loader.init().then((monacoInstance) => {
  // Add custom HTML completions for Anki field syntax
  monacoInstance.languages.registerCompletionItemProvider("html", {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        {
          label: "{{Field}}",
          kind: monacoInstance.languages.CompletionItemKind.Field,
          insertText: "{{FieldName}}",
          documentation: "Insert an Anki field reference",
          range: range,
        },
        {
          label: "{{FrontSide}}",
          kind: monacoInstance.languages.CompletionItemKind.Keyword,
          insertText: "{{FrontSide}}",
          documentation: "Show the front side of the card (back template only)",
          range: range,
        },
        {
          label: "Conditional Field",
          kind: monacoInstance.languages.CompletionItemKind.Snippet,
          insertText: "{{#Field}}\n\tcontent\n{{/Field}}",
          documentation: "Conditional field display",
          range: range,
        },
        {
          label: "Empty Field Check",
          kind: monacoInstance.languages.CompletionItemKind.Snippet,
          insertText: "{{^Field}}\n\tcontent\n{{/Field}}",
          documentation: "Show content when field is empty",
          range: range,
        },
        {
          label: "{{cloze:Field}}",
          kind: monacoInstance.languages.CompletionItemKind.Function,
          insertText: "{{cloze:Field}}",
          documentation: "Cloze deletion field",
          range: range,
        },
      ];

      return { suggestions: suggestions };
    },
  });

  // Add CSS completions for common Anki card styling
  monacoInstance.languages.registerCompletionItemProvider("css", {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        {
          label: ".card",
          kind: monacoInstance.languages.CompletionItemKind.Class,
          insertText: ".card {\n\t/* card styles */\n}",
          documentation: "Main card container",
          range: range,
        },
        {
          label: ".cloze",
          kind: monacoInstance.languages.CompletionItemKind.Class,
          insertText: ".cloze {\n\t/* cloze styles */\n}",
          documentation: "Cloze deletion styling",
          range: range,
        },
        {
          label: "font-family: Inter",
          kind: monacoInstance.languages.CompletionItemKind.Property,
          insertText:
            "font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;",
          documentation: "Modern font stack with Inter",
          range: range,
        },
      ];

      return { suggestions: suggestions };
    },
  });
});

export default monaco;
