import { backendApi } from "next-common/services/nextApi";
import { useEffect, useState } from "react";
import DemocracyStatistics from "../democracy";
import Loading from "next-common/components/loading";
import { EmptyList } from "next-common/utils/constants";

export default function TrackDelegationList({ trackId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    delegatee: EmptyList,
    delegators: EmptyList,
    trackSummary: {},
  });

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      backendApi.fetch(`referenda/tracks/${trackId}/delegatee`, {
        sort: JSON.stringify(["delegatedVotes", "desc"]),
        pageSize: 25,
      }),
      backendApi.fetch(`referenda/tracks/${trackId}/delegators`, {
        sort: JSON.stringify(["votes", "desc"]),
        pageSize: 25,
      }),
      backendApi.fetch(`referenda/tracks/${trackId}/summary`),
    ])
      .then(
        ([
          { result: delegatee },
          { result: delegators },
          { result: trackSummary },
        ]) => {
          setData({
            delegatee: delegatee ?? EmptyList,
            delegators: delegators ?? EmptyList,
            trackSummary: trackSummary ?? {},
          });
        },
      )
      .finally(() => {
        setIsLoading(false);
      });
  }, [trackId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center !my-8">
        <Loading size={18} />
      </div>
    );
  }

  return (
    <DemocracyStatistics
      apiRoot={`referenda/tracks/${trackId}`}
      delegatee={data?.delegatee}
      delegators={data?.delegators}
      summary={data?.trackSummary}
    />
  );
}
