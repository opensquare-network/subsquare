import useRealAddress from "next-common/utils/hooks/useRealAddress";
import DotSplitter from "next-common/components/dotSplitter";
import { fetchFellowshipSalaryFeeds } from "next-common/services/fellowship/salary";
import FellowshipSalaryStatsDetailLink from "next-common/components/overview/fellowship/salary/detailLink";
import LoadableContent from "next-common/components/common/loadableContent";
import { useAsync } from "react-use";

function useMyStatus() {
  const realAddress = useRealAddress();

  const data = useAsync(async () => {
    if (realAddress) {
      return fetchFellowshipSalaryFeeds(1, 1, {
        who: realAddress,
      }).then((resp) => {
        if (resp.result) {
          return resp.result?.items?.[0];
        }
      });
    }
  }, [realAddress]);

  return data;
}

export default function FellowshipSalaryMyStatus() {
  const status = useMyStatus();
  const realAddress = useRealAddress();

  const index = status.value?.index;
  const event = status.value?.event || "Nothing";

  if (!realAddress) {
    return null;
  }

  return (
    <div className="bg-neutral200 rounded py-1.5 px-3 text12Medium flex items-center">
      <div className="text12Bold text-textPrimary">My Status</div>
      <div className="ml-4 text-textTertiary inline-flex items-center gap-x-1">
        Last Activity{" "}
        <LoadableContent size={12} isLoading={status.loading}>
          {index ? (
            <FellowshipSalaryStatsDetailLink
              className="text12Medium"
              index={index}
            >
              #{index}
            </FellowshipSalaryStatsDetailLink>
          ) : (
            <div className="text-textSecondary">-</div>
          )}
        </LoadableContent>
      </div>

      <div>
        <DotSplitter />
      </div>

      <div className="text-textTertiary inline-flex items-center gap-x-1">
        Status{" "}
        <LoadableContent size={12} isLoading={status.loading}>
          <div className="text-textSecondary">{event}</div>
        </LoadableContent>
      </div>
    </div>
  );
}
