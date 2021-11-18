import MembersList from "components/membersList/councilMembersList";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import Layout from "components/layout";
import { useApi, useCall } from "utils/hooks";
import { useEffect, useState } from "react";
import { getNode } from "utils";

export default withLoginUserRedux(({ loginUser, chain }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi(chain);
  const node = getNode(chain);
  const electionsInfo = useCall(api?.derive.elections.info, []);
  const allVotes = useCall(api?.derive.council.votes, []);
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
          votes: votesMap[address] || 0,
        };
      });
      setData(data);
      setLoading(false);
    }
  }, [electionsInfo, allVotes]);

  return (
    <Layout user={loginUser} left={<Menu menu={mainMenu} />} chain={chain}>
      <MembersList
        chain={chain}
        category={"Council Members"}
        items={data}
        loading={loading}
        hasElections={node?.hasElections}
      />
    </Layout>
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
