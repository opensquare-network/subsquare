import Gov2Sidebar from "next-common/components/pages/components/gov2/sidebar";
import { useEffect } from "react";
import { unsetIssuance } from "next-common/store/reducers/gov2ReferendumSlice";
import { useDispatch } from "react-redux";
import ReferendaDetail from "next-common/components/detail/referenda";
import useSubReferendumInfo from "next-common/hooks/referenda/useSubReferendumInfo";
import { clearVotes } from "next-common/store/reducers/referenda/votes";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";
import ReferendumDetailMultiTabs from "../tabs/referendumDetailMultiTabs";

export function ReferendumContent() {
  const dispatch = useDispatch();
  useSubReferendumInfo();
  // const onchainData = useOnchainData();
  // useFetchVotes(onchainData);

  useEffect(() => {
    return () => {
      dispatch(unsetIssuance());
      dispatch(clearVotes());
    };
  }, [dispatch]);

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <ReferendaDetail />
        <Gov2Sidebar />
        <ReferendumDetailMultiTabs />
      </ContentWithComment>
    </MaybeSimaContent>
  );
}
