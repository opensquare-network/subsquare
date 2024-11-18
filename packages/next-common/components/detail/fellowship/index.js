import DetailContentBase from "../common/detailBase";
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
import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";

const FellowshipReferendaDetailEvidence = dynamicClientOnly(() =>
  import("./evidence"),
);

export default function FellowshipReferendaDetail() {
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
      <MaybeSimaDiscussionArticleContent />
      <FellowshipReferendaDetailEvidence />
    </DetailContentBase>
  );
}
