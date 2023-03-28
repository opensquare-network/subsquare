import MembersList from "components/fellowship/memberList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import HomeLayout from "next-common/components/layout/HomeLayout";

export default withLoginUserRedux(({ tracks, fellowshipTracks }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const members = useCall(
    api?.query?.fellowshipCollective?.members.entries,
    []
  );

  useEffect(() => {
    if (!members) {
      return;
    }

    const data = [];
    for (const item of members) {
      const [
        {
          args: [id],
        },
        option,
      ] = item;
      const address = id.toJSON();
      const { rank } = option.toJSON();
      data.push({ address, rank });
    }
    data.sort((a, b) => b.rank - a.rank);

    setData(data);
    setLoading(false);
  }, [members]);

  const category = "Fellowship Members";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout
      seoInfo={seoInfo}
      tracks={tracks}
      fellowshipTracks={fellowshipTracks}
    >
      <MembersList category={category} items={data} loading={loading} />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
