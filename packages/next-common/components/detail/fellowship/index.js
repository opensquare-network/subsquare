import DetailContentBase from "../common/detailBase";
import ArticleContent from "../../articleContent";
import useSetEdit from "../common/hooks/useSetEdit";
import PostTitle from "next-common/components/detail/common/Title";
import ReferendaPostMeta from "next-common/components/detail/common/openGov/meta";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import FellowshipWhitelistNavigation from "next-common/components/detail/fellowship/whitelistNavigation";
import PreimageWarning from "next-common/components/detail/referenda/preimageWarning";
import FellowshipTimeoutCountdown from "next-common/components/detail/fellowship/timeoutCountdown";
import TimeoutGuard from "next-common/components/detail/common/openGov/timeoutGuard";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import FellowshipReferendumTreasurySpendNavigation from "./fellowshipReferendumTreasurySpendNavigation";

const FellowshipReferendaDetailEvidence = dynamicClientOnly(() =>
  import("./evidence"),
);

export default function FellowshipReferendaDetail() {
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={
        !isEditing && (
          <>
            <PreimageWarning />
            <TimeoutGuard>
              <FellowshipTimeoutCountdown />
            </TimeoutGuard>
            <FellowshipWhitelistNavigation />
            <FellowshipReferendumTreasurySpendNavigation />
          </>
        )
      }
      title={<PostTitle />}
      meta={<ReferendaPostMeta section="fellowship" />}
    >
      <ArticleContent className="mt-6" setIsEdit={setIsEdit} />

      <FellowshipReferendaDetailEvidence />
    </DetailContentBase>
  );
}
