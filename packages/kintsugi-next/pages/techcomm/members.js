import MembersList from "next-common/components/membersList/techCommMembersList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import usePrime from "next-common/utils/hooks/usePrime";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";

export default withLoginUserRedux(({ loginUser, chain }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi(chain);
  const members = useCall(api?.derive.technicalCommittee.members, []);
  const prime = usePrime({ chain, type: detailPageCategory.TECH_COMM_MOTION });
  useEffect(() => {
    if (members) {
      setData(members.toJSON() || []);
      setLoading(false);
    }
  }, [members]);
  const category = `Technical Committee Members`;
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout user={loginUser} seoInfo={seoInfo}>
      <MembersList
        chain={chain}
        prime={prime}
        category={category}
        items={data}
        loading={loading}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  return {
    props: {
      chain,
    },
  };
});
