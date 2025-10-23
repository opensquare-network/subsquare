import useQueryAllMultisigData from "next-common/components/data/multisig/hooks/useQueryAllMultisigData";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

export default function useFetchProfileMultisigs({
  queryType,
  page,
  pageSize,
}) {
  const address = useProfileAddress();
  const { data, isLoading } = useQueryAllMultisigData({
    search: address,
    queryType,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });

  return {
    data,
    isLoading,
  };
}
