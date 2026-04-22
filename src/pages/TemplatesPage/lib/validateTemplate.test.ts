import { describe, it, expect } from "vitest";
import {
  validateTemplate,
  validateCss,
  type TemplateError,
} from "./validateTemplate";

describe("validateTemplate", () => {
  it("returns no errors for a valid field reference", () => {
    const errors = validateTemplate("{{Front}}", ["Front", "Back"]);
    expect(errors).toHaveLength(0);
  });

  it("returns an error when a referenced field does not exist", () => {
    const errors = validateTemplate("{{Question}}", ["Front", "Back"]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("Question");
    expect(errors[0].severity).toBe("error");
  });

  it("reports the correct line and column for an unknown field", () => {
    const errors = validateTemplate("line1\n{{BadField}}", ["Front"]);
    expect(errors[0].line).toBe(2);
    expect(errors[0].column).toBe(1);
  });

  it("returns an error for an unclosed {{", () => {
    const errors = validateTemplate("{{Front", ["Front"]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toMatch(/Missing closing }}/);
  });

  it("returns no errors for a valid conditional block", () => {
    const errors = validateTemplate("{{#Front}}text{{/Front}}", ["Front"]);
    expect(errors).toHaveLength(0);
  });

  it("returns an error for an unclosed conditional block", () => {
    const errors = validateTemplate("{{#Front}}text", ["Front"]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("{{/Front}}");
  });

  it("returns an error for a closing conditional without a matching opening", () => {
    const errors = validateTemplate("{{/Front}}", ["Front"]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toMatch(/no matching/);
  });

  it("returns an error for mismatched conditional tags", () => {
    const errors = validateTemplate("{{#One}}{{/Two}}", ["One", "Two"]);
    const mismatchError = errors.find((e: TemplateError) =>
      e.message.includes("expected {{/One}}")
    );
    expect(mismatchError).toBeDefined();
  });

  it("returns no errors for negated conditional with existing field", () => {
    const errors = validateTemplate("{{^Back}}no back{{/Back}}", [
      "Front",
      "Back",
    ]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors for special Anki fields", () => {
    const errors = validateTemplate(
      "{{Tags}} {{Type}} {{Deck}} {{Subdeck}} {{Card}} {{FrontSide}}",
      []
    );
    expect(errors).toHaveLength(0);
  });

  it("returns no errors for the text: filter with an existing field", () => {
    const errors = validateTemplate("{{text:Front}}", ["Front"]);
    expect(errors).toHaveLength(0);
  });

  it("returns an error for the text: filter with a non-existent field", () => {
    const errors = validateTemplate("{{text:Question}}", ["Front"]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("Question");
  });

  it("returns no errors for hint: filter with an existing field", () => {
    const errors = validateTemplate("{{hint:MyField}}", ["MyField"]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors for cloze: filter with an existing field", () => {
    const errors = validateTemplate("{{cloze:Text}}", ["Text"]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors for type: filter with an existing field", () => {
    const errors = validateTemplate("{{type:Foreign Word}}", ["Foreign Word"]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors for tts filter", () => {
    const errors = validateTemplate("{{tts en_US:Front}}", ["Front"]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors for cloze card conditional markers like {{#c1}}", () => {
    const errors = validateTemplate("{{#c1}}hint{{/c1}}", ["Text"]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors for multiple valid field references", () => {
    const errors = validateTemplate(
      '<h1>{{Front}}</h1><hr id="answer"><p>{{Back}}</p>',
      ["Front", "Back"]
    );
    expect(errors).toHaveLength(0);
  });

  it("returns multiple errors for multiple unknown fields", () => {
    const errors = validateTemplate("{{A}} {{B}}", []);
    expect(errors).toHaveLength(2);
  });
});

describe("validateCss", () => {
  it("returns no errors for valid CSS", () => {
    const errors = validateCss(".card { color: red; font-size: 16px; }");
    expect(errors).toHaveLength(0);
  });

  it("returns no errors for empty CSS", () => {
    const errors = validateCss("");
    expect(errors).toHaveLength(0);
  });

  it("returns an error for an empty property value", () => {
    const errors = validateCss(".card { color: ; }");
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].severity).toBe("error");
  });

  it("returns an error for unclosed brace", () => {
    const errors = validateCss(".card { color: red;");
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/unclosed/i);
  });

  it("returns an error for unexpected closing brace", () => {
    const errors = validateCss(".card { color: red; } }");
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/unexpected/i);
  });
});
