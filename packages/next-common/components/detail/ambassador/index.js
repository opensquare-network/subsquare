import DetailContentBase from "next-common/components/detail/common/detailBase";
import PreimageWarning from "next-common/components/detail/referenda/preimageWarning";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import useUndecidingTimeout from "next-common/hooks/referendaPallet/useUndecidingTimeout";
import BaseTimeoutCountdown from "next-common/components/detail/common/openGov/baseTimoutCountdown";
import React from "react";
import TimeoutGuard from "next-common/components/detail/common/openGov/timeoutGuard";
import PostTitle from "next-common/components/detail/common/Title";
import ReferendaPostMeta from "next-common/components/detail/common/openGov/meta";
import ArticleContent from "next-common/components/articleContent";
import useSetEdit from "next-common/components/detail/common/hooks/useSetEdit";
import FellowshipReferendaDetailEvidence from "../fellowship/evidence";

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
  const setIsEdit = useSetEdit();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={!isEditing && <NonEditingHead />}
      title={<PostTitle />}
      meta={<ReferendaPostMeta section="ambassador" />}
    >
      <ArticleContent className="mt-6" setIsEdit={setIsEdit} />

      <FellowshipReferendaDetailEvidence />
    </DetailContentBase>
  );
}
