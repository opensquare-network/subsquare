import dynamic from "next/dynamic";
import Link from "next-common/components/link";
import Loading from "next-common/components/loading";
import { cn } from "next-common/utils";

const ArrowRight = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.ArrowRight),
);
const SystemSwitch = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.SystemSwitch),
);

const buttonClassName = cn(
  "inline-flex items-center justify-center",
  "h-7 px-[11px] rounded-md",
  "border border-neutral400 text12Medium text-textPrimary bg-neutral100",
);

export default function SubstrateAddressLink({
  substrateAddress,
  isResolving,
}) {
  const content = (
    <>
      {isResolving ? (
        <span className="inline-flex items-center mr-2">
          <Loading size={16} />
        </span>
      ) : (
        <SystemSwitch className="w-4 h-4 mr-2 text-textTertiary" />
      )}
      <span>Substrate Address</span>
      <ArrowRight className="w-4 h-4 ml-1 text-textTertiary" />
    </>
  );

  if (isResolving || !substrateAddress) {
    return (
      <button
        type="button"
        disabled
        className={cn(buttonClassName, "opacity-60 cursor-not-allowed")}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={`/user/${substrateAddress}`}
      className={cn(buttonClassName, "hover:border-neutral500")}
    >
      {content}
    </Link>
  );
}
