import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useOnchainData } from "next-common/context/post";
import { unsetIssuance } from "next-common/store/reducers/gov2ReferendumSlice";
import ReferendaDetail from "next-common/components/detail/referenda";
import useSubReferendumInfo from "next-common/hooks/referenda/useSubReferendumInfo";
import { clearVotes } from "next-common/store/reducers/referenda/votes";
import useFetchVotes from "next-common/utils/gov2/useFetchVotes";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { SimaProposalCommentActionsProvider } from "next-common/sima/components/common/context/commentActionsProvider";
import { SimaProposalArticleActionsProvider } from "next-common/sima/components/common/context/articleActionsProvider";
import Gov2Sidebar from "components/gov2/sidebar";
import { ReferendumDetailMultiTabs } from "../referendaContent";

export function SimaReferendumContent() {
  const dispatch = useDispatch();
  useSubReferendumInfo();
  const onchainData = useOnchainData();
  useFetchVotes(onchainData);

  useEffect(() => {
    return () => {
      dispatch(unsetIssuance());
      dispatch(clearVotes());
    };
  }, [dispatch]);

  return (
    <SimaProposalArticleActionsProvider>
      <SimaProposalCommentActionsProvider>
        <ContentWithComment>
          <ReferendaDetail />
          <Gov2Sidebar />
          <ReferendumDetailMultiTabs />
        </ContentWithComment>
      </SimaProposalCommentActionsProvider>
    </SimaProposalArticleActionsProvider>
  );
}
