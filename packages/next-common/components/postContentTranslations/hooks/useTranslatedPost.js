import { useState, useEffect, useCallback } from "react";
import { LANGUAGE_CODES } from "../constants";
// import { backendApi } from "next-common/services/nextApi";

// TODO: return translated post
const fetchTranslatedPost = async (languageCode, originalPost) => {
  // const content = await backendApi.fetch(translatedPostsApi, {
  //   who: address,
  //   postId: originalPost.id,
  //   language: languageCode,
  // });

  // Mock data
  const content = `Translated content for ${languageCode}`;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...originalPost,
        content,
      });
    }, 500);
  });
};

export function useTranslatedPost(originalPost, selectedLanguage) {
  const [translatedPost, setTranslatedPost] = useState(originalPost);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTranslation = useCallback(
    async (languageCode) => {
      if (languageCode === LANGUAGE_CODES.SOURCE) {
        setTranslatedPost(originalPost);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await fetchTranslatedPost(
          languageCode,
          originalPost,
        );
        setTranslatedPost(translated);
      } catch (err) {
        throw new Error(`Failed to fetch translation for ${languageCode}`);
      } finally {
        setIsLoading(false);
      }
    },
    [originalPost],
  );

  useEffect(() => {
    if (selectedLanguage) {
      fetchTranslation(selectedLanguage);
    }
  }, [selectedLanguage, fetchTranslation]);

  return {
    translatedPost,
    isLoading,
  };
}
