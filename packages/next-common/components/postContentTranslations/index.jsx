import TranslationsSelect from "./translationsSelect";
import TranslatedPostContent from "./content";
import PostContentTranslationsProvider from "./context";

export default function PostContentTranslations({ post, isFold }) {
  return (
    <>
      <PostContentTranslationsProvider post={post} isFold={isFold}>
        <TranslationsSelect />
        <TranslatedPostContent />
      </PostContentTranslationsProvider>
    </>
  );
}
