import MembersList from "next-common/components/membersList/simpleMembersList";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import usePrime from "next-common/utils/hooks/usePrime";
import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import { useContextApi } from "next-common/context/api";

export default function CommunityCouncilMembersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useContextApi();
  const { value: members } = useCall(api?.query?.communityCouncil?.members, []);
  const prime = usePrime();
  useEffect(() => {
    if (members) {
      setData(members.toJSON() || []);
      setLoading(false);
    }
  }, [members]);
  const category = "Community Council Members";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout title={category} seoInfo={seoInfo}>
      <MembersList prime={prime} items={data} loading={loading} />
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
