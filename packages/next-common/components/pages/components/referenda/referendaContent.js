import Gov2Sidebar from "next-common/components/pages/components/gov2/sidebar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ReferendaDetail from "next-common/components/detail/referenda";
import useSubReferendumInfo from "next-common/hooks/referenda/useSubReferendumInfo";
import { clearVotes } from "next-common/store/reducers/referenda/votes";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";
import ReferendumDetailMultiTabs from "../tabs/referendumDetailMultiTabs";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import ReferendaAppendants from "next-common/components/appendants/referenda";
import { ReferendaAppendantsProvider } from "next-common/context/referendaAppendants";
import ThresholdCurvePopup from "next-common/components/gov2/referendum/curvePopup";
import { ReferendaContentWrapper } from "next-common/components/layout/DetailLayout/referendaDetailLayout";

export function ReferendumContent() {
  const indexer = useReferendumVotingFinishIndexer();

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      <ReferendumContentInContext />
    </MigrationConditionalApiProvider>
  );
}

function ReferendumContentInContext() {
  const dispatch = useDispatch();
  useSubReferendumInfo();

  useEffect(() => {
    return () => {
      dispatch(clearVotes());
    };
  }, [dispatch]);

  return (
    <MaybeSimaContent>
      <ReferendaContentWrapper hasSidebar>
        <ContentWithComment>
          <ReferendaAppendantsProvider>
            <ReferendaDetail />
            <ReferendaAppendants />
          </ReferendaAppendantsProvider>
          <ThresholdCurvePopup />
          <div className="md:hidden">
            <Gov2Sidebar />
          </div>
          <ReferendumDetailMultiTabs />
        </ContentWithComment>
      </ReferendaContentWrapper>
      <div className="max-md:hidden">
        <Gov2Sidebar />
      </div>
    </MaybeSimaContent>
  );
}
