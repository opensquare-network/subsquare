import { SystemBlock } from "@osn/icons/subsquare";
import ExternalLink from "next-common/components/externalLink";
import Pagination from "next-common/components/pagination";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";

export default function ProfileFellowshipCoreSectionEvidence() {
  const [navCollapsed] = useNavCollapsed();

  const evidences = [
    {
      title: "Evidence-001: Retain at rank 3",
      date: "2022-01-01",
      cid: "",
    },
  ];

  return (
    <div>
      <div
        className={cn(
          "grid grid-cols-3 gap-4",
          !navCollapsed && "max-md:grid-cols-2",
          "max-sm:grid-cols-1",
        )}
      >
        {evidences.map((evidence, idx) => (
          <NeutralPanel key={idx} className="p-6">
            <div className="text16Bold text-textPrimary">{evidence.title}</div>
            <div className="text14Medium text-textTertiary mt-1">
              {evidence.date}
            </div>
            <div className="mt-4 flex items-center gap-x-2">
              <ExternalLink
                href={getIpfsLink(evidence.cid)}
                externalIcon={false}
                className="text-textTertiary hover:text-textSecondary"
              >
                <SystemBlock className="w-5 h-5" />
              </ExternalLink>
            </div>
          </NeutralPanel>
        ))}
      </div>

      <Pagination />
    </div>
  );
}
