import CallTreeView from "../callTreeView";
import Loading from "../loading";

export default function CallTree({ call, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-[24px]">
        <Loading size={20} />
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex justify-center py-[24px] text-textTertiary text14Medium">
        <span>Fail to parse</span>
      </div>
    );
  }

  return <CallTreeView proposal={call} />;
}
