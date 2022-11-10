import MembersList from "components/membersList/councilMembersList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import usePrime from "next-common/utils/hooks/usePrime";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { useChainSettings } from "next-common/context/chain";

export default withLoginUserRedux(({}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const { hasElections } = useChainSettings();
  const electionsInfo = useCall(api?.derive?.elections?.info, []);
  const allVotes = useCall(api?.derive?.council?.votes, []);
  const prime = usePrime({ type: detailPageCategory.COUNCIL_MOTION });

  useEffect(() => {
    if (electionsInfo) {
      const votesMap = {};
      (allVotes || []).forEach((item) => {
        const votes = item[1].votes.toJSON();
        for (const addr of votes) {
          votesMap[addr] = (votesMap[addr] || 0) + 1;
        }
      });

      const data = (electionsInfo.members || []).map((item) => {
        const address = item[0]?.toJSON();
        return {
          address,
          backing: item[1]?.toJSON(),
          votes: votesMap[address],
        };
      });
      setData(data);
      setLoading(false);
    }
  }, [electionsInfo, allVotes]);
  const category = "Council Members";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout seoInfo={seoInfo}>
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
  return {
    props: {},
  };
});
