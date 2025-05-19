import { useState } from "react";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import useRefCallback from "next-common/hooks/useRefCallback";
import { backendApi } from "next-common/services/nextApi";
import {
  ambassadorTrackReferendaSummaryApi,
  fellowshipReferendumsTracksSummaryApi,
  gov2ReferendumsTracksSummaryApi,
} from "next-common/services/url";

function useTrackSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const listPageType = useListPageType();

  const apiMap = {
    [listPageCategory.REFERENDA]: gov2ReferendumsTracksSummaryApi,
    [listPageCategory.FELLOWSHIP_REFERENDA]:
      fellowshipReferendumsTracksSummaryApi,
    [listPageCategory.AMBASSADOR_REFERENDA]: ambassadorTrackReferendaSummaryApi,
  };

  const fetchTrackSummary = useRefCallback(async (trackId) => {
    setIsLoading(true);
    try {
      const apiFunc = apiMap[listPageType];
      if (!apiFunc) {
        setSummary(null);
        return;
      }
      const { result: trackReferendaSummary } = await backendApi.fetch(
        apiFunc(trackId),
      );
      setSummary(trackReferendaSummary);
    } catch (error) {
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  });

  return { summary, fetchTrackSummary, isLoading };
}

export default useTrackSummary;
