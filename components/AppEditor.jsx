/* eslint-disable react/jsx-props-no-spreading */
'use client';

import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';

const loadReactQuill = async () => {
  const { default: RQ } = await import('react-quill');
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
  onChange,
  value = '',
  placeholder = '',
  toolbarBottom = false,
}) => {
  const editorRef = useRef(null);
  const quillContainerRef = useRef(null);
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionListPosition, setMentionListPosition] = useState({
    top: 0,
    left: 0,
  });
  const [filteredMentions, setFilteredMentions] = useState([]);

  const mentions = [
    { id: 1, value: 'Calvin' },
    { id: 2, value: 'Samiul' },
    { id: 3, value: 'Riaz' },
  ];

  const handleContentChange = (content, delta, source, editor) => {
    if (source === 'user') {
      const cursorPosition = editor.getSelection()?.index;
      if (cursorPosition) {
        const textBeforeCursor = editor.getText(0, cursorPosition);
        const atIndex = textBeforeCursor.lastIndexOf('@');

        if (atIndex > -1) {
          const wordEnd = textBeforeCursor.length;
          const searchTerm = textBeforeCursor.substring(atIndex + 1, wordEnd);

          const newFilteredMentions = mentions.filter((m) =>
            m.value.toLowerCase().startsWith(searchTerm.toLowerCase())
          );
          setFilteredMentions(newFilteredMentions);

          setShowMentionList(newFilteredMentions.length > 0);
          const bounds = editor.getBounds(cursorPosition);
          setMentionListPosition({ top: bounds.bottom, left: bounds.left });
        } else {
          setShowMentionList(false);
        }
      }
    }
    onChange(content);
  };

  const handleSelectMention = (mention) => {
    const editor = editorRef.current.getEditor();
    const range = editor.getSelection(true);
    if (range) {
      editor.deleteText(range.index - 1, 1);
      editor.insertText(range.index - 1, `@${mention.value} `, { bold: true });
      editor.setSelection(range.index + mention.value.length);
      setShowMentionList(false);
      onChange(editor.getContents());
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        quillContainerRef.current &&
        !quillContainerRef.current.contains(event.target)
      ) {
        setShowMentionList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor();
      if (editor && editor.container) {
        quillContainerRef.current = editor.container;
      }
    }
  }, [editorRef]);

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ header: 1 }, { header: 2 }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ align: [] }],
      ['link', 'image', 'video', 'formula'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'formula',
    'align',
    'direction',
    'clean',
  ];

  const editorClassName = toolbarBottom ? 'editor-toolbar-bottom' : '';

  return (
    <div className={`react-quill-editor ${editorClassName} relative`}>
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
      {showMentionList && (
        <div
          className='absolute z-10 mt-1 bg-white rounded border border-gray-300 shadow-lg'
          style={{
            top: mentionListPosition.top,
            left: mentionListPosition.left,
          }}
        >
          {filteredMentions.map((mention) => (
            <div
              key={mention.id}
              className='px-4 py-2 cursor-pointer hover:bg-blue-100'
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectMention(mention);
              }}
            >
              {mention.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppEditor;
