import Loading from "next-common/components/loading";
import Tooltip from "next-common/components/tooltip";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";

const globalCache = new Map();

function TitleTooltipContent({ id }) {
  const { value, loading } = useAsync(async () => {
    if (!globalCache.has(id)) {
      globalCache.set(id, backendApi.fetch(`/treasury/bounties/${id}`));
    }
    const resp = await globalCache.get(id);
    return resp?.result;
  }, [id]);

  if (loading) {
    return <Loading size={16} />;
  }
  if (!value?.title) {
    return null;
  }
  return <div>{value?.title}</div>;
}

export default function TreasuryBountiesTitleTooltip({ children, id }) {
  return (
    <Tooltip content={<TitleTooltipContent id={id} />}>{children}</Tooltip>
  );
}
