import { createContext, useContext, useState } from "react";
import { DEFAULT_LANGUAGE_OPTION } from "../constants";
import { useTranslatedPost } from "../hooks/useTranslatedPost";

const PostContentTranslationsContext = createContext(null);

export default function PostContentTranslationsProvider({
  defaultLanguage = DEFAULT_LANGUAGE_OPTION.value,
  post,
  isFold,
  children,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const { translatedPost, isLoading } = useTranslatedPost(
    post,
    selectedLanguage,
  );

  return (
    <PostContentTranslationsContext.Provider
      value={{
        isFold,
        selectedLanguage,
        setSelectedLanguage,
        post: translatedPost,
        isTranslationLoading: isLoading,
      }}
    >
      {children}
    </PostContentTranslationsContext.Provider>
  );
}

export function usePostContentTranslationsContext() {
  return useContext(PostContentTranslationsContext);
}
