import { useState, useEffect } from "react";
import CommonMultisigsTable from "next-common/components/profile/multisigs/commonTable";
import useFetchProfileMultisigs from "../useFetchProfileMultisigs";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { ListCard } from "next-common/components/overview/styled";

export default function SignatoryMultisigs() {
  const [total, setTotal] = useState(0);
  const [multisigs, setMultisigs] = useState(null);
  const { page, component: pageComponent } = usePaginationComponent(total, 15);
  const { data, isLoading } = useFetchProfileMultisigs({
    queryType: "signatory",
    page,
    pageSize: 15,
  });

  useEffect(() => {
    if (isLoading || !data) {
      return;
    }

    setTotal(data?.total || 0);
    setMultisigs(data?.multisigs || []);
  }, [data, isLoading]);

  return (
    <ListCard>
      <CommonMultisigsTable multisigs={multisigs} isLoading={isLoading} />
      {pageComponent}
    </ListCard>
  );
}
