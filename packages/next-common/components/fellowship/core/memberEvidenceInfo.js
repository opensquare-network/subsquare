import { MenuHorn } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import Loading from "next-common/components/loading";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useEvidencesCombineReferenda from "next-common/hooks/useEvidencesCombineReferenda";

export default function MemberEvidenceInfo({ className }) {
  const { evidences, isLoading } = useEvidencesCombineReferenda();

  let content = null;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center">
        <Loading size={20} />
      </div>
    );
  } else {
    const totalEvidences = evidences.length || 0;
    const evidencesToBeHandled =
      evidences.filter((evidence) => isNil(evidence.referendumIndex)).length ||
      0;

    content = (
      <div className="flex gap-[16px]">
        <div>
          <div className="bg-theme100 rounded-[8px] p-[8px]">
            <MenuHorn
              className="[&_path]:fill-theme500"
              width={24}
              height={24}
            />
          </div>
        </div>
        <div className="text-textPrimary text14Medium">
          <ul className="list-disc list-inside [&_li]">
            <li className="pl-[1em]">
              {evidencesToBeHandled} evidences to be handled in total{" "}
              {totalEvidences} evidences.
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return <SecondaryCard className={className}>{content}</SecondaryCard>;
}
