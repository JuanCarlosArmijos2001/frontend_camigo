import React from 'react';
import Editor from '@monaco-editor/react';

function CEditor() {
  const handleEditorChange = (value, event) => {
    console.log('here is the current model value:', value);
  };

  return (
    <Editor
      height="90vh"
      defaultLanguage="c"
      defaultValue="// some comment"
      onChange={handleEditorChange}
    />
  );
}

export default CEditor;
