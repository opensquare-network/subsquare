import MembersList from "components/membersList/councilMembersList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import usePrime from "next-common/utils/hooks/usePrime";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { useChainSettings } from "next-common/context/chain";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

export default withLoginUserRedux(({ tracks, fellowshipTracks }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const { hasElections } = useChainSettings();
  const [electionsInfo, loadingElectionsInfo] = useCall(api?.derive?.elections?.info, []);
  const [allVotes, loadingAllVotes] = useCall(api?.derive?.council?.votes, []);
  const prime = usePrime({ type: detailPageCategory.COUNCIL_MOTION });

  useEffect(() => {
    setLoading(loadingElectionsInfo || loadingAllVotes);

    if (!loadingElectionsInfo && !loadingAllVotes) {
      const votesMap = {};
      (allVotes || []).forEach((item) => {
        const votes = item[1].votes.toJSON();
        for (const addr of votes) {
          votesMap[addr] = (votesMap[addr] || 0) + 1;
        }
      });

      const data = (electionsInfo?.members || []).map((item) => {
        const address = item[0]?.toJSON();
        return {
          address,
          backing: item[1]?.toJSON(),
          votes: votesMap[address],
        };
      });
      setData(data);
    }
  }, [electionsInfo, loadingElectionsInfo, allVotes, loadingAllVotes]);

  const category = "Council Members";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout
      seoInfo={seoInfo}
      tracks={tracks}
      fellowshipTracks={fellowshipTracks}
    >
      <MembersList
        category={category}
        items={data}
        prime={prime}
        loading={loading}
        hasElections={hasElections}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
