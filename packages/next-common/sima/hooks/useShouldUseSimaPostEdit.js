const { usePost } = require("next-common/context/post");
const { useArticleActions } = require("../context/articleActions");
const {
  detailPageCategory,
} = require("next-common/utils/consts/business/category");

export default function useShouldUseSimaPostEdit() {
  const post = usePost();
  const { supportSima } = useArticleActions();

  if (!supportSima) {
    return false;
  }

  if (post?.refToPost?.postType === detailPageCategory.POST) {
    return post?.refToPost?.dataSource === "sima";
  }

  return true;
}
