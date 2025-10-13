import { useState, useEffect, useCallback } from "react";
import { LANGUAGE_CODES } from "../constants";
import { postContentTranslationsApi } from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";

const fetchTranslatedPost = async (languageCode, originalPost) => {
  let postType = "post";
  let postId = originalPost._id;
  if (originalPost.rootPost) {
    postType = originalPost.rootPost.postType;
    postId = originalPost.rootPost.postId;
  }

  const { result, error } = await backendApi.post(postContentTranslationsApi, {
    lang: languageCode,
    postType,
    postId,
  });

  return new Promise((resolve, reject) => {
    if (error) {
      reject(new Error(error));
    }

    const content = result?.translation || "";
    resolve({
      ...originalPost,
      content,
      ...(originalPost.dataSource === "polkassembly"
        ? { polkassemblyContentHtml: content }
        : {}),
    });
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
