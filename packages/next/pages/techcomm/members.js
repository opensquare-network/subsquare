import MembersList from "next-common/components/membersList/techCommMembersList";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import Layout from "components/layout";
import { useApi } from "utils/hooks";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";

export default withLoginUserRedux(({ loginUser, chain, siteUrl }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi(chain);
  const members = useCall(api?.derive.technicalCommittee.members, []);
  useEffect(() => {
    if (members) {
      setData(members.toJSON() || []);
      setLoading(false);
    }
  }, [members]);
  const category = "Technical Committee Members";
  const seoInfo = {title:category,desc:category};

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} chain={chain} />}
      chain={chain}
      seoInfo={seoInfo}
    >
      <MembersList
        chain={chain}
        category={category}
        items={data}
        loading={loading}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
      siteUrl: process.env.SITE_URL,
    },
  };
});
