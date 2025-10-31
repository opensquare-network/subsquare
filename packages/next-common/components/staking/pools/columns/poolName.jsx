import { cn } from "next-common/utils";
import { usePoolMetadata } from "../hooks/usePoolMetadata";
import LoadableContent from "next-common/components/common/loadableContent";

export default function PoolNameColumn({ poolId, className }) {
  const { name, loading } = usePoolMetadata(poolId);

  return (
    <div
      title={name}
      className={cn(
        "flex-1 overflow-hidden text-textPrimary flex line-clamp-1 mr-4 text14Medium",
        className,
      )}
    >
      <span className="text-textPrimary after:content-['·'] after:text-textTertiary after:mx-2">
        #{poolId}
      </span>
      <div className="cursor-pointer hover:underline truncate break-words max-w-[280px]">
        <LoadableContent isLoading={loading}>{name || "-"}</LoadableContent>
      </div>
    </div>
  );
}
