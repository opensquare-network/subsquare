import MembersList from "components/membersList";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import Layout from "components/layout";
import { useApi, useCall } from "utils/hooks";
import { useEffect, useState } from "react";

export default withLoginUserRedux(({ loginUser, chain }) => {
  const [data, setData] = useState([]);
  const api = useApi(chain);
  const electionsInfo = useCall(api?.derive.elections.info, []);
  const allVotes = useCall(api?.derive.council.votes, []);
  useEffect(() => {
    if (electionsInfo?.members.length) {
      const votesMap = new Map(allVotes || []);
      const data = (electionsInfo?.members || []).map(item => ({
        address: item[0].toJSON(),
        backing: votesMap.get(item)?.stake || "0",
        votes: votesMap.get(item)?.votes?.length || 0,
      }));
      setData(data);
    }
  }, [electionsInfo, allVotes]);

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      chain={chain}
    >
      <MembersList
        chain={chain}
        category={"Council Members"}
        items={data}
        hasElections={true}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { chain } = context.query;

  return {
    props: {
      chain,
    },
  };
});
