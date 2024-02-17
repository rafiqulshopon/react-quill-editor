/* eslint-disable react/jsx-props-no-spreading */
'use client';

import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import 'react-quill/dist/quill.snow.css';

const loadReactQuill = async () => {
  const { default: RQ } = await import('react-quill');

  if (RQ) {
    await import('quill-mention');
  }

  const reactQuillWithRef = ({ forwardedRef, ...props }) => (
    <RQ ref={forwardedRef} {...props} />
  );

  return reactQuillWithRef;
};

const ReactQuill = dynamic(loadReactQuill, {
  ssr: false,
});

const AppEditor = ({
  readOnly = false,
  onChange = () => {},
  value = '',
  placeholder = '',
  toolbarBottom = false,
}) => {
  const editorRef = useRef(null);

  const atValues = [
    { id: 1, value: 'Calvin' },
    { id: 2, value: 'Samiul' },
    { id: 3, value: 'Riaz' },
  ];

  const handleContentChange = (item) => {
    onChange(item);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'video'],
    ],
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ['@'],
      source: function (searchTerm, renderList) {
        if (searchTerm.length === 0) {
          renderList(atValues, searchTerm);
        } else {
          const matches = atValues.filter((v) =>
            v.value.toLowerCase().includes(searchTerm.toLowerCase())
          );
          renderList(matches, searchTerm);
        }
      },
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'video',
    'mention',
  ];

  const editorClassName = toolbarBottom ? 'editor-toolbar-bottom' : '';

  return (
    <div className={`react-quill-editor ${editorClassName}`}>
      <ReactQuill
        forwardedRef={editorRef}
        theme='snow'
        value={value}
        onChange={handleContentChange}
        readOnly={readOnly}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default AppEditor;
