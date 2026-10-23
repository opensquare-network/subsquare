import { usePost } from "next-common/context/post";
import { useArticleActions } from "next-common/sima/context/articleActions";
import LegacyCreateAppendantPopup from "./legacyCreatePopup";
import SimaCreateAppendantPopup from "./simaCreatePopup";

export default function ReferendaCreateAppendantPopup({ setIsAppend }) {
  const post = usePost();
  const { supportSima } = useArticleActions();

  const isSimaPost =
    supportSima && post?.refToPost?.postType === "referendaReferendum";

  if (isSimaPost) {
    return <SimaCreateAppendantPopup setIsAppend={setIsAppend} />;
  }

  return <LegacyCreateAppendantPopup setIsAppend={setIsAppend} />;
}
