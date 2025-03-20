import { LinkIpfs, LinkSubsquare } from "@osn/icons/subsquare";
import ExternalLink from "next-common/components/externalLink";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import dayjs from "dayjs";
import NoData from "next-common/components/noData";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useState } from "react";
import FellowshipEvidenceContent from "next-common/components/collectives/core/evidenceContent";

const getDate = (row) => {
  return dayjs(row?.indexer?.blockTime).format("YYYY/MM/DD") || "";
};

const getTitle = (row) => {
  const { wish, rank } = row;
  const adposition = wish === "Retention" ? "at" : "to";
  const realRankValue = wish === "Promotion" ? rank + 1 : rank;
  return `${wish} ${adposition} Rank ${realRankValue}`;
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

const EvidenceItem = ({ row, popupTitle = "" }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NeutralPanel className="p-6">
        <div
          role="button"
          className="text16Bold text-textPrimary hover:underline"
          onClick={() => {
            setOpen(true);
          }}
        >
          {getTitle(row)}
        </div>
        <div className="text14Medium text-textTertiary mt-1">
          {getDate(row)}
        </div>
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

      {open && (
        <Popup
          title={popupTitle || "Evidence Detail"}
          className="w-[800px] max-w-full"
          onClose={() => {
            setOpen(false);
          }}
        >
          <hr className="my-4" />
          <FellowshipEvidenceContent evidence={row.hex} wish={row.wish} />
        </Popup>
      )}
    </>
  );
};

const EvidenceList = ({
  rows,
  className = "",
  popupTitle = "",
  noDateText = "",
}) => {
  const [navCollapsed] = useNavCollapsed();
  if (rows.length === 0) {
    return <NoData showIcon={false} text={noDateText || "No evidence"} />;
  }
  return (
    <div>
      <div
        className={cn(
          "grid grid-cols-3 gap-4",
          !navCollapsed && "max-md:grid-cols-2",
          "max-sm:grid-cols-1",
          className,
        )}
      >
        {rows.map((row) => (
          <EvidenceItem key={row._id} row={row} popupTitle={popupTitle} />
        ))}
      </div>
    </div>
  );
};

export default EvidenceList;
