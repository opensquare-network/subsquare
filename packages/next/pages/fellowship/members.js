import MembersList from "components/fellowship/memberList";
import { withLoginUserRedux } from "next-common/lib";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";

export default withLoginUserRedux(() => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const [members] = useCall(
    api?.query?.fellowshipCollective?.members.entries,
    [],
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
    <ListLayout seoInfo={seoInfo} title={category}>
      <MembersList items={data} loading={loading} />
    </ListLayout>
  );
});

export const getServerSideProps = getServerSidePropsWithTracks;
