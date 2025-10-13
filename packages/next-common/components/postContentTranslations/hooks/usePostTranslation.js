import { useState, useEffect, useCallback } from "react";
import { LANGUAGE_CODES } from "../constants";
import { backendApi } from "next-common/services/nextApi";

const extractPostInfo = (originalPost) => {
  if (originalPost.rootPost) {
    return {
      postType: originalPost.rootPost.postType,
      postId: originalPost.rootPost.postId,
    };
  }

  return {
    postType: "post",
    postId: originalPost._id,
  };
};

const createTranslatedPost = (originalPost, content) => ({
  ...originalPost,
  content,
  ...(originalPost.dataSource === "polkassembly" && {
    polkassemblyContentHtml: content,
  }),
});

const doTranslation = async (languageCode, originalPost) => {
  const { postType, postId } = extractPostInfo(originalPost);
  const { result, error } = await backendApi.post("translations", {
    lang: languageCode,
    postType,
    postId,
  });
  if (error) {
    throw new Error(error);
  }

  return createTranslatedPost(originalPost, result?.translation || "");
};

export default function usePostTranslation(originalPost, selectedLanguage) {
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
        const translated = await doTranslation(languageCode, originalPost);
        setTranslatedPost(translated);
      } catch (err) {
        console.error(`Translation failed for ${languageCode}:`, err);
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
