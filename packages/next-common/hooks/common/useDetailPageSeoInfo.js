import { usePost } from "next-common/context/post";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";

export default function useDetailPageSeoInfo() {
  const post = usePost();
  const desc = getMetaDesc(post);
  return {
    title: post?.title,
    desc,
    ogImage: getBannerUrl(post?.bannerCid),
  };
}
