import { LinkIpfs, LinkSubsquare } from "@osn/icons/subsquare";
import ExternalLink from "next-common/components/externalLink";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import dayjs from "dayjs";
import NoData from "next-common/components/noData";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

const getDate = (row) => {
  return dayjs(row?.indexer?.blockTime).format("YYYY/MM/DD") || "";
};

const getTitle = (row) => {
  const { wish, rank } = row;
  const adposition = wish === "Retention" ? "at" : "to";
  return `${wish} ${adposition} Rank ${rank}`;
};

const SubSquareLinks = ({ referenda }) => {
  const { section } = useCollectivesContext();
  if (referenda.length > 0) {
    return referenda.slice(0, 3).map((item) => {
      const { index } = item;
      const link = `/${section}/referenda/${index}`;
      return (
        <ExternalLink
          key={index}
          href={link}
          externalIcon={false}
          className="text-textTertiary hover:text-textSecondary"
        >
          <LinkSubsquare className="w-5 h-5" />
        </ExternalLink>
      );
    });
  }
  return "";
};

const EvidenceItem = ({ row }) => {
  return (
    <NeutralPanel className="p-6">
      <div className="text16Bold text-textPrimary">{getTitle(row)}</div>
      <div className="text14Medium text-textTertiary mt-1">{getDate(row)}</div>
      <div className="mt-4 flex items-center gap-x-2">
        <SubSquareLinks referenda={row?.referenda || []} />
        <ExternalLink
          href={getIpfsLink(row.cid)}
          externalIcon={false}
          className="text-textTertiary hover:text-textSecondary"
        >
          <LinkIpfs className="w-5 h-5" />
        </ExternalLink>
      </div>
    </NeutralPanel>
  );
};

const EvidenceList = ({ rows }) => {
  const [navCollapsed] = useNavCollapsed();
  if (rows.length === 0) {
    return <NoData showIcon={false} text="No evidence" />;
  }
  return (
    <div>
      <div
        className={cn(
          "grid grid-cols-3 gap-4",
          !navCollapsed && "max-md:grid-cols-2",
          "max-sm:grid-cols-1",
        )}
      >
        {rows.map((row) => (
          <EvidenceItem key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
};

export default EvidenceList;
