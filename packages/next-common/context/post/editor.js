import React from "react";

const EditorContext = React.createContext();

export default EditorContext;

export function EditorProvider({ children, focusEditor }) {
  return (
    <EditorContext.Provider value={{ focusEditor }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useFocusEditor() {
  const { focusEditor } = React.useContext(EditorContext);
  return focusEditor;
}
