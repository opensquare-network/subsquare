import { usePost } from "next-common/context/post";
import { useArticleActions } from "next-common/sima/context/articleActions";
import LegacyEditAppendantPopup from "./legacyEditPopup";
import SimaEditAppendantPopup from "./simaEditPopup";

export default function ReferendaEditAppendantPopup({ onClose, editData }) {
  const post = usePost();
  const { supportSima } = useArticleActions();

  const isSimaAppendant =
    supportSima &&
    editData?.dataSource === "sima" &&
    !!editData?.cid &&
    post?.refToPost?.postType === "referendaReferendum";

  if (isSimaAppendant) {
    return <SimaEditAppendantPopup onClose={onClose} editData={editData} />;
  }

  return <LegacyEditAppendantPopup onClose={onClose} editData={editData} />;
}
