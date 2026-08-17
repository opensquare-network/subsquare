import { useTokenIcon } from "next-common/components/assethubMigrationAssets/liquidPools/table/columns/tokenPair";
import { cn } from "next-common/utils";

export default function TokenIcon({ token, className = "w-4 h-4" }) {
  const Icon = useTokenIcon(token);
  if (!Icon) {
    return null;
  }

  // eslint-disable-next-line react-hooks/static-components
  return <Icon aria-hidden="true" className={cn("shrink-0", className)} />;
}
