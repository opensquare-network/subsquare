import { createContext, useContext, useState } from "react";

const PostContentTranslationsContext = createContext(null);

// TODO: select language context trigger & hook
export default function PostContentTranslationsProvider({
  post,
  isFold,
  children,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState("");

  return (
    <PostContentTranslationsContext.Provider
      value={{ post, isFold, selectedLanguage, setSelectedLanguage }}
    >
      {children}
    </PostContentTranslationsContext.Provider>
  );
}

export function usePostContentTranslationsContext() {
  return useContext(PostContentTranslationsContext);
}
