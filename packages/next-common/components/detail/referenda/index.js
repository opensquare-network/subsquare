import DetailContentBase from "../common/detailBase";
import ArticleContent from "../../articleContent";
import useSetEdit from "../common/hooks/useSetEdit";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import PostTitle from "next-common/components/detail/common/Title";
import Divider from "next-common/components/styled/layout/divider";
import ReferendaPostMeta from "next-common/components/detail/common/openGov/meta";
import ReferendaWhiteListNavigation from "next-common/components/detail/referenda/whitelistNavigation";
import ReferendaReferendumNavigation from "next-common/components/detail/navigation/referendaReferendumNavigation";
import TimeoutCountdown from "next-common/components/detail/referenda/timeoutCountdown";
import PreimageWarning from "next-common/components/detail/referenda/preimageWarning";
import TimeoutGuard from "next-common/components/detail/common/openGov/timeoutGuard";

export default function ReferendaDetail() {
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase>
      {!isEditing && (
        <>
          <PreimageWarning />
          <TimeoutGuard>
            <TimeoutCountdown />
          </TimeoutGuard>
          <ReferendaWhiteListNavigation />
          <ReferendaReferendumNavigation />
        </>
      )}
      <PostTitle />
      <Divider className="my-4" />
      <ReferendaPostMeta />

      <ArticleContent className="mt-6" setIsEdit={setIsEdit} />
    </DetailContentBase>
  );
}
