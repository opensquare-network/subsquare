import { MenuHorn } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import BillBoardPanel from "next-common/components/billBoardPanel";
import { useChain } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { useDvDelegateGuardians } from "next-common/context/referenda/dv";
import { cn } from "next-common/utils";
import { isKusamaChain, isPolkadotChain } from "next-common/utils/chain";
import Link from "next/link";

export default function DvInfoPanel() {
  const { cohort, cohorts } = usePageProps();
  const chain = useChain();

  let tokensText = "";
  if (isPolkadotChain(chain)) {
    tokensText = "millions of DOT";
  } else if (isKusamaChain(chain)) {
    tokensText = "thousands of KSM";
  }

  if (isNil(cohort)) {
    return null;
  }

  return (
    <BillBoardPanel
      className="[&>div:last-child]:flex-1"
      icon={<MenuHorn className="[&_path]:fill-theme500" />}
      items={[
        tokensText && <LearnLine key="learn" tokensText={tokensText} />,
        <span key="latest" className="text14Medium flex items-center gap-x-1">
          The latest DV cohort is {cohorts?.length || 0} with{" "}
          {cohort?.delegateCnt || 0} delegates
          <GuardianTips />.
        </span>,
        <span
          key="tracks"
          className="text14Medium flex items-center gap-x-2 gap-y-1 flex-wrap"
        >
          <span>
            The latest DV cohort supports {cohort?.tracks?.length || 0} tracks,
            including
          </span>
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
      ].filter(Boolean)}
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

function LearnLine({ tokensText = "" }) {
  return (
    <span>
      The Decentralized Voices program empowers broader community participation
      in OpenGov by delegating {tokensText}.
      <a
        className="text-textTertiary ml-1 -top-[1px] hover:text-theme500"
        href="https://wiki.polkadot.com/general/decentralized-voices/"
        target="_blank"
        rel="noreferrer"
      >
        ↗
      </a>
    </span>
  );
}

function GuardianTips() {
  const { hasGuardians, guardiansCount } = useDvDelegateGuardians();

  if (!hasGuardians) {
    return null;
  }

  return ` and ${guardiansCount} guardians`;
}
