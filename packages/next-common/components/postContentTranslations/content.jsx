import { BannerImage } from "next-common/components/articleContent";
import PostContent from "next-common/components/detail/common/PostContent";
import { isPostEdited } from "next-common/utils/post";
import { EDITED_TRANSLATIONS, LANGUAGE_CODES } from "./constants";
import { usePostContentTranslationsContext } from "./context";
import Loading from "next-common/components/loading";

function getEditedText(languageCode) {
  return (
    EDITED_TRANSLATIONS[languageCode] ||
    EDITED_TRANSLATIONS[LANGUAGE_CODES.SOURCE]
  );
}

export default function TranslatedPostContent() {
  const { post, isFold, selectedLanguage, isTranslationLoading } =
    usePostContentTranslationsContext();

  if (isTranslationLoading) {
    return (
      <div className="flex items-center justify-center gap-x-2 text-textTertiary text14Medium py-8">
        <Loading size={24} />
        The translation process may take a while
      </div>
    );
  }

  return (
    <>
      <BannerImage bannerCid={post.bannerCid} />
      <PostContent post={post} isFold={isFold} />
      {isPostEdited(post) && (
        <div className="mt-4 text12Medium text-textTertiary">
          {getEditedText(selectedLanguage)}
        </div>
      )}
    </>
  );
}
