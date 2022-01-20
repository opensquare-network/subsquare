import MembersList from "components/membersList/techCommMembersList";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import Layout from "components/layout";
import { useApi, useCall } from "utils/hooks";
import { useEffect, useState } from "react";
import SEO from "components/SEO";

export default withLoginUserRedux(({ loginUser, chain, siteUrl }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi(chain);
  const members = useCall(api?.query?.financialCouncil?.members, []);
  useEffect(() => {
    if (members) {
      setData(members.toJSON() || []);
      setLoading(false);
    }
  }, [members]);

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} chain={chain} />}
      chain={chain}
    >
      <SEO
        title={`Financial Council Members`}
        desc={`Financial Council Members`}
        siteUrl={siteUrl}
        chain={chain}
      />
      <MembersList
        chain={chain}
        category={"Financial Council Members"}
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
