import { useState, useEffect } from "react";
import { SystemLoading } from "@osn/icons/subsquare";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import {
  ambassadorCoreEvidencesApiUri,
  fellowshipCoreEvidencesApiUri,
} from "next-common/services/url";
import EvidenceList from "./list";
import { usePageProps } from "next-common/context/page";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";

const DEFAULT_PAGE_SIZE = 24;

const ProfileFellowshipCoreEvidence = ({
  setEvidenceCount,
  className = "",
  popupTitle = "",
  noDateText = "",
}) => {
  const { id: address } = usePageProps();
  const [total, setTotal] = useState(0);
  const { page, component: pageComponent } = usePaginationComponent(
    total,
    DEFAULT_PAGE_SIZE,
  );

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
      setTotal(value?.total);
    }
  }, [value?.total, setEvidenceCount]);

  return (
    <div>
      {loading ? (
        <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto text-textDisabled" />
      ) : (
        <EvidenceList
          rows={rows}
          className={className}
          popupTitle={popupTitle}
          noDateText={noDateText}
        />
      )}
      {pageComponent}
    </div>
  );
};

export default ProfileFellowshipCoreEvidence;
