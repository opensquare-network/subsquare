import MembersList from "next-common/components/membersList/techCommMembersList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import usePrime from "next-common/utils/hooks/usePrime";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";

export default withLoginUserRedux(() => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const [members] = useCall(api?.query?.advisoryCommittee?.members, []);
  const prime = usePrime({ type: detailPageCategory.ADVISORY_MOTION });
  useEffect(() => {
    if (members) {
      setData(members.toJSON() || []);
      setLoading(false);
    }
  }, [members]);
  const category = "Advisory Council Members";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <MembersList
        prime={prime}
        category={category}
        items={data}
        loading={loading}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {},
  };
});
