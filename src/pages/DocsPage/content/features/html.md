---
title: HTML file uploads
description: Information on how HTML files are handled on 2anki.net
---

To perserve colors, fonts and backgrounds use HTML file uploads. 
2anki.net has support for Notion but you can upload custom HTML files to 2anki.net.

The default behavior is to use toggles for the flashcards. Below are examples of the suppported flashcards.

## Basic flashcard

```html
<details>
  <summary>What is the capital of Albania?</summary>
  <p>Tirana!</p>
</details>
```


## Cloze deletion

```html
<details>
  <summary>The capital of <code>Albania</code> is <code>Tirana</code></summary>
</details>  
```

If you would like to group your cloze and add hints it can be done this way:

```html
<div class='toggle'>{{c1::Canberra::city}} was founded in {{c2::1913::year}}</div>
```

## Input flashcard

TODO: show example using bold text
