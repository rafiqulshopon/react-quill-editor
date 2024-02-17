'use client';

import React, { useState } from 'react';
import AppEditor from '@/components/AppEditor';

export default function Home() {
  const [editorContent, setEditorContent] = useState('');

  const handleEditorChange = (content) => {
    console.log('Editor content:', content);
    setEditorContent(content);
  };

  console.log('Editor content:', editorContent);

  return (
    <main className='p-6'>
      <AppEditor
        onChange={handleEditorChange}
        value={editorContent}
        placeholder='Enter your message here...'
      />
    </main>
  );
}
