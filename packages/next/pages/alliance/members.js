import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import MembersList from "components/alliance/membersList";
import AllianceSummary from "components/alliance/summary";

export default withLoginUserRedux(() => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const members = useCall(api?.query?.alliance?.members.entries, []);
  useEffect(() => {
    if (!members) {
      return;
    }
    const data = members.reduce(
      (
        { list: prevList, ...prevOthers },
        [
          {
            args: [role],
          },
          list,
        ]
      ) => {
        const memberRole = role.toJSON();
        const memberList = list.toJSON();
        const currList = memberList.map((address) => ({ address, memberRole }));
        const currCount = { [memberRole?.toLowerCase()]: memberList?.length };
        return {
          list: [...prevList, ...currList],
          ...prevOthers,
          ...currCount,
        };
      },
      { list: [], fellow: 0, ally: 0, retiring: 0 }
    );
    setData(data);
    setLoading(false);
  }, [members]);

  const category = "Members";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <TitleContainer>{category}</TitleContainer>
      <AllianceSummary
        fellow={data.fellow}
        ally={data.ally}
        retiring={data.retiring}
      />
      <MembersList category={category} items={data.list} loading={loading} />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {},
  };
});
