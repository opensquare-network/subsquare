import { useCollectivesSection } from "next-common/context/collectives/collectives";
import { useRouter } from "next/router";

export default function ViewDetailButton({ address }) {
  const section = useCollectivesSection();
  const router = useRouter();
  return (
    <div
      role="button"
      className="border-l border-neutral300 pl-[16px] text14Medium text-theme500"
      onClick={() => {
        router.push(`/${section}/members/${address}`);
      }}
    >
      Detail
    </div>
  );
}
