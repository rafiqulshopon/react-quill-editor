# React/Next.js Quill Editor

This repository contains a React/Next.js component that integrates the powerful [Quill editor](https://quilljs.com/) with additional mention functionality. It is designed to work with Next.js and uses dynamic imports to ensure client-side rendering.

## Features

- Rich Text Editing: Bold, italic, underline, strikethrough, and blockquotes.
- Lists: Ordered and bullet lists with indents.
- Media Embedding: Ability to embed links and videos.
- Mentioning: Mention functionality for tagging.
- Customizable: Easy to extend with more Quill modules and formats.

## Installation

Before you can use the editor, you must install it along with its peer dependencies.

```bash
npm install react-quill quill-mention
```

## Usage

To use the `AppEditor` component in your Next.js application, import it into your component file:

```jsx
import AppEditor from '@/components/AppEditor';

// ...

<AppEditor
  readOnly={false}
  onChange={handleContentChange}
  value={yourValue}
  placeholder='Write something amazing...'
/>;
```

`handleContentChange` is a callback function that receives the new content whenever it changes.

## Customizing Toolbar and Formats

The editor's toolbar and formats can be customized to fit the needs of your application. Modify the `modules` and `formats` arrays in `AppEditor.jsx` to include or exclude specific functionalities.

## Mention Functionality

The mention functionality is asynchronous and can be tailored to fetch data from an external API or other asynchronous sources.

## Contributions

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes or enhancements.
