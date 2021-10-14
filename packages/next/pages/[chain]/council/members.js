import MembersList from "components/membersList";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import Layout from "components/layout";

const TEST_DATA = [
  {
    address: "ouJX1WJQ9s4RMukAx5zvMwPY2zJZ9Xr5euzRG97Ne6UTNG9",
    backing: "11111110000000000",
    votes: 12,
  },
  {
    address: "qMJYLJEP2HTBFhxqTFAJz9RcsT9UQ3VW2tFHRBmyaxPdj1n",
    backing: "1110000000000",
    votes: 12,
  },
  {
    address: "qPnkT89PRdiCbBgvE6a6gLcFCqWC8F1UoCZUhFvjbBkXMXc",
    backing: "1110000000000",
    votes: 12,
  },
  {
    address: "ra6MmAYU2qdCVsMS3REKZ82CJ1EwMWq6H6Zo475xTzedctJ",
    backing: "1110000000000",
    votes: 12,
  },
  {
    address: "sZCH1stvMnSuDK1EDpdNepMYcpZWoDt3yF3PnUENS21f2tA",
    backing: "1110000000000",
    votes: 12,
  },
  {
    address: "ts9q95ZJmaCMCPKuKTY4g5ZeK65GdFVz6ZDD8LEnYJ3jpbm",
    backing: "1110000000000",
    votes: 12,
  },
];

export default withLoginUserRedux(({ loginUser, chain }) => {
  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      chain={chain}
    >
      <MembersList
        chain={chain}
        category={"Council Members"}
        items={TEST_DATA}
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
