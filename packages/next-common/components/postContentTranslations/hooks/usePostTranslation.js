import { useState, useEffect, useCallback, useRef } from "react";
import { LANGUAGE_CODES } from "../constants";
import { backendApi } from "next-common/services/nextApi";

const createTranslatedPost = (originalPost, content) => ({
  ...originalPost,
  content,
  ...(originalPost.dataSource === "polkassembly" && {
    polkassemblyContentHtml: content,
  }),
});

const doTranslation = async (languageCode, originalPost, signal) => {
  const { postType, postId } = originalPost.refToPost;
  const { result, error } = await backendApi.post(
    "translations",
    {
      lang: languageCode,
      postType,
      postId,
    },
    { signal },
  );

  if (error) {
    throw new Error(error);
  }

  return createTranslatedPost(originalPost, result?.translation || "");
};

export default function usePostTranslation(originalPost, selectedLanguage) {
  const [translatedPost, setTranslatedPost] = useState(originalPost);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const lastLanguageRef = useRef("");

  const fetchTranslation = useCallback(
    async (languageCode) => {
      if (languageCode === lastLanguageRef.current) {
        return;
      }

      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        if (languageCode === LANGUAGE_CODES.SOURCE) {
          setTranslatedPost(originalPost);
          setIsLoading(false);
          lastLanguageRef.current = languageCode;
          return;
        }

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setIsLoading(true);
        lastLanguageRef.current = languageCode;

        const translated = await doTranslation(
          languageCode,
          originalPost,
          signal,
        );

        if (!signal.aborted && lastLanguageRef.current === languageCode) {
          setTranslatedPost(translated);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        if (lastLanguageRef.current === languageCode) {
          console.error(`Translation failed for ${languageCode}:`, err);
          throw new Error(`Failed to fetch translation for ${languageCode}`);
        }
      } finally {
        if (
          lastLanguageRef.current === languageCode &&
          (!abortControllerRef.current ||
            !abortControllerRef.current.signal.aborted)
        ) {
          setIsLoading(false);
        }
      }
    },
    [originalPost],
  );

  useEffect(() => {
    if (selectedLanguage) {
      fetchTranslation(selectedLanguage);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      lastLanguageRef.current = "";
    };
  }, [selectedLanguage, fetchTranslation]);

  return {
    translatedPost,
    isLoading,
  };
}
