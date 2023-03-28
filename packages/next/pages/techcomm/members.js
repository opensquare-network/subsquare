import MembersList from "next-common/components/membersList/techCommMembersList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import usePrime from "next-common/utils/hooks/usePrime";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

export default withLoginUserRedux(({ tracks, fellowshipTracks }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const members = useCall(api?.derive.technicalCommittee.members, []);
  const prime = usePrime({ type: detailPageCategory.TECH_COMM_MOTION });
  useEffect(() => {
    if (members) {
      setData(members.toJSON() || []);
      setLoading(false);
    }
  }, [members]);
  const category = "Technical Committee Members";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout
      seoInfo={seoInfo}
      tracks={tracks}
      fellowshipTracks={fellowshipTracks}
    >
      <MembersList
        prime={prime}
        category={category}
        items={data}
        loading={loading}
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
