import { useCollectivesSection } from "next-common/context/collectives/collectives";
import Link from "next/link";

export default function ViewDetailButton({ address }) {
  const section = useCollectivesSection();
  return (
    <Link
      href={`/${section}/members/${address}`}
      className="border-l border-neutral300 pl-[16px] text14Medium text-theme500"
    >
      Detail
    </Link>
  );
}
