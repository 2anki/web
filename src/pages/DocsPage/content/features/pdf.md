---
title: PDF
description: PDF support on 2anki.net
---

There are two ways to create Anki flashcards from PDFs on 2anki.net

## 1. AI-Powered Question Generation (Premium Feature)

This method uses Google's Vertex AI to automatically generate questions from your PDF content.

**Note:** This is a premium subscriber-only feature. If enabled, your PDF content will be processed through Google Cloud's Vertex AI service.

### How it works:

1. Upload your PDF file
2. AI converts PDF content to HTML
3. Questions and answers are automatically generated
4. Download as Anki deck

**Privacy Note:** Using this feature means your PDF content will be sent to Google Cloud for processing. If you have sensitive content, consider using Method 2 instead.

## 2. PDF Page-to-Flashcard Conversion

This method converts your PDF pages directly into flashcards, with each page becoming either the front or back of a card.

### How it works:
1. Upload your PDF file
2. Each pair of consecutive pages becomes one flashcard:
   - Odd-numbered pages (1,3,5...) become card fronts
   - Even-numbered pages (2,4,6...) become card backs
3. The pages are converted to images for compatibility
4. Download as Anki deck

### Limitations:
- Default method when AI generation is not activated
- Free users: Maximum 100 pages per PDF
- Premium users: Support for 1000+ pages
- All processing happens locally - no cloud services involved

### Best suited for:
- Pre-formatted question/answer PDFs
- Study materials already organized in a Q&A format
- Maintaining complete privacy of PDF contents
