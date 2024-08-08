import { useState, useEffect } from "react";
import { SystemLoading } from "@osn/icons/subsquare";
import Pagination from "next-common/components/pagination";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import {
  ambassadorCoreEvidencesApiUri,
  fellowshipCoreEvidencesApiUri,
} from "next-common/services/url";
import { useRouter } from "next/router";
import EvidenceList from "./list";
import { usePageProps } from "next-common/context/page";

const DEFAULT_PAGE_SIZE = 24;

const ProfileFellowshipCoreEvidence = ({ setEvidenceCount }) => {
  const { id: address } = usePageProps();
  const router = useRouter();
  const [page, setPage] = useState(parseInt(router.query.page || 1));

  const { section } = useCollectivesContext();
  const evidencesApi =
    section === "fellowship"
      ? fellowshipCoreEvidencesApiUri
      : ambassadorCoreEvidencesApiUri;

  const { value = {}, loading } = useAsync(async () => {
    if (!evidencesApi) {
      return;
    }

    const resp = await nextApi.fetch(evidencesApi, {
      who: address,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    });

    return resp?.result;
  }, [page, address, evidencesApi]);

  const rows = value?.items || [];

  useEffect(() => {
    if (value?.total !== undefined) {
      setEvidenceCount(value?.total);
    }
  }, [value?.total, setEvidenceCount]);

  return (
    <div>
      {loading ? (
        <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto text-textDisabled" />
      ) : (
        <EvidenceList rows={rows} />
      )}
      <Pagination
        page={page}
        pageSize={value?.pageSize}
        total={value?.total}
        onPageChange={(_, page) => {
          setPage(page);
        }}
        shallow
      />
    </div>
  );
};

export default ProfileFellowshipCoreEvidence;
