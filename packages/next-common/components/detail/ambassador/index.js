import React from "react";
import DetailContentBase from "next-common/components/detail/common/detailBase";
import PreimageWarning from "next-common/components/detail/referenda/preimageWarning";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import useUndecidingTimeout from "next-common/hooks/referendaPallet/useUndecidingTimeout";
import BaseTimeoutCountdown from "next-common/components/detail/common/openGov/baseTimoutCountdown";
import TimeoutGuard from "next-common/components/detail/common/openGov/timeoutGuard";
import PostTitle from "next-common/components/detail/common/Title";
import ReferendaPostMeta from "next-common/components/detail/common/openGov/meta";
import MaybeSimaDiscussionArticleContent from "next-common/components/maybeSimaDiscussionArticleContent";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

const FellowshipReferendaDetailEvidence = dynamicClientOnly(() =>
  import("../fellowship/evidence"),
);

export function TimeoutCountdown() {
  const timeout = useUndecidingTimeout("ambassadorReferenda");
  return <BaseTimeoutCountdown timeout={timeout} />;
}

function NonEditingHead() {
  return (
    <>
      <PreimageWarning />
      <TimeoutGuard>
        <TimeoutCountdown />
      </TimeoutGuard>
    </>
  );
}

export default function AmbassadorReferendaDetail() {
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={!isEditing && <NonEditingHead />}
      title={<PostTitle />}
      meta={<ReferendaPostMeta section="ambassador" />}
    >
      <MaybeSimaDiscussionArticleContent />

      <FellowshipReferendaDetailEvidence />
    </DetailContentBase>
  );
}
