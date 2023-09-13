import MembersList from "next-common/components/membersList/simpleMembersList";
import { withLoginUser } from "next-common/lib";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import usePrime from "next-common/utils/hooks/usePrime";
import ListLayout from "next-common/components/layout/ListLayout";

export default function AdvisoryCommitteeMembersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const [members] = useCall(api?.query?.advisoryCommittee?.members, []);
  const prime = usePrime();
  useEffect(() => {
    if (members) {
      setData(members.toJSON() || []);
      setLoading(false);
    }
  }, [members]);
  const category = "Advisory Council Members";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout title={category} seoInfo={seoInfo}>
      <MembersList prime={prime} items={data} loading={loading} />
    </ListLayout>
  );
}

export const getServerSideProps = withLoginUser();
