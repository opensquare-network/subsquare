import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useOnchainData } from "next-common/context/post";
import { unsetIssuance } from "next-common/store/reducers/gov2ReferendumSlice";
import ReferendaDetail from "next-common/components/detail/referenda";
import useSubReferendumInfo from "next-common/hooks/referenda/useSubReferendumInfo";
import { clearVotes } from "next-common/store/reducers/referenda/votes";
import useFetchVotes from "next-common/utils/gov2/useFetchVotes";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { ReferendaCommentActionsProvider } from "next-common/sima/components/referenda/context/commentActionsProvider";
import { ReferendaArticleActionsProvider } from "next-common/sima/components/referenda/context/articleActionsProvider";
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
    <ReferendaArticleActionsProvider>
      <ReferendaCommentActionsProvider>
        <ContentWithComment>
          <ReferendaDetail />
          <Gov2Sidebar />
          <ReferendumDetailMultiTabs />
        </ContentWithComment>
      </ReferendaCommentActionsProvider>
    </ReferendaArticleActionsProvider>
  );
}
