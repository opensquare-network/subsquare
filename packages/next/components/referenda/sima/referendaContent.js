import { useOnchainData } from "next-common/context/post";
import Gov2Sidebar from "components/gov2/sidebar";
import { useEffect } from "react";
import { unsetIssuance } from "next-common/store/reducers/gov2ReferendumSlice";
import { useDispatch } from "react-redux";
import SimaReferendaDetail from "next-common/sima/components/referenda/detail";
import useSubReferendumInfo from "next-common/hooks/referenda/useSubReferendumInfo";
import { clearVotes } from "next-common/store/reducers/referenda/votes";
import useFetchVotes from "next-common/utils/gov2/useFetchVotes";
import ContentWithComment from "next-common/sima/components/post/contentWithComment";
import { ReferendaCommentActionsContextProvider } from "next-common/sima/components/referenda/context/commentActionsProvider";
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
    <ReferendaCommentActionsContextProvider>
      <ContentWithComment>
        <SimaReferendaDetail />

        <Gov2Sidebar />

        <ReferendumDetailMultiTabs />
      </ContentWithComment>
    </ReferendaCommentActionsContextProvider>
  );
}
