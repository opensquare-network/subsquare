import { MenuHorn } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import BillBoardPanel from "next-common/components/billBoardPanel";
import { usePageProps } from "next-common/context/page";
import { cn } from "next-common/utils";
import Link from "next/link";

export default function Prompt() {
  const { cohort, cohorts } = usePageProps();

  if (isNil(cohort)) {
    return null;
  }

  return (
    <BillBoardPanel
      icon={<MenuHorn className="[&_path]:fill-theme500" />}
      items={[
        <span
          key="learn"
          className="flex items-center gap-x-2 gap-y-1 flex-wrap"
        >
          <span>Click</span>
          <a
            className="text-theme500"
            href="https://wiki.polkadot.com/general/decentralized-voices/"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>{" "}
          <span>to learn about decentralized voices</span>
        </span>,
        <span key="latest" className="text14Medium">
          The latest issue of coordination is {cohorts?.length},{" "}
          <a
            className="text-theme500"
            href={cohort?.announcementLink || ""}
            target="_blank"
            rel="noreferrer"
          >
            announcement
          </a>
        </span>,
        <span key="delegates" className="text14Medium">
          The cohort has {cohort?.delegateCnt} delegates
        </span>,
        <span
          key="tracks"
          className="text14Medium flex items-center gap-x-2 gap-y-1 flex-wrap"
        >
          <span>Dv tracks </span>
          {cohort?.tracks?.map((track, index) => (
            <Track
              key={track}
              id={track}
              className={
                index < cohort?.tracks?.length - 1 &&
                "after:content-[','] after:text-textPrimary"
              }
            />
          ))}
        </span>,
      ]}
    />
  );
}

function Track({ id, className = "" }) {
  const { tracks } = usePageProps();
  const track = tracks.find((track) => track.id === id);

  if (!track) {
    return null;
  }

  return (
    <Link
      key={track}
      href={`/referenda/tracks/${track.id}`}
      className={cn(className, "text-theme500")}
    >
      {track.name}
    </Link>
  );
}
