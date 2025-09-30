import Loading from "next-common/components/loading";
import Tooltip from "next-common/components/tooltip";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";

function TitleTooltipContent({ title, loading }) {
  if (loading) {
    return <Loading size={16} />;
  }
  if (!title) {
    return null;
  }
  return <div>{title}</div>;
}

export default function TreasuryBountiesTitleTooltip({ children, id }) {
  const { value, loading } = useAsync(async () => {
    const resp = await backendApi.fetch(`/treasury/bounties/${id}`);
    return resp?.result;
  }, [id]);

  return (
    <Tooltip
      content={<TitleTooltipContent title={value?.title} loading={loading} />}
    >
      {children}
    </Tooltip>
  );
}
