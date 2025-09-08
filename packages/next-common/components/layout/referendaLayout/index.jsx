import { SubscribeTip, TitleExtra } from "next-common/components/overview";
import ListLayout from "../ListLayout";
import Gov2SummaryFooter from "next-common/components/summary/gov2SummaryFooter";
import { useUser } from "next-common/context/user";
import { useRouter } from "next/router";
import { useChain, useChainSettings } from "next-common/context/chain";
import dynamic from "next/dynamic";
import { DvLabel } from "./tabTitle";
import Chains from "next-common/utils/consts/chains";

const Gov2Summary = dynamic(
  () => import("next-common/components/summary/gov2Summary"),
  { ssr: false },
);

function HeadContent() {
  return (
    <div className="md:hidden">
      <SubscribeTip />
    </div>
  );
}

export default function ReferendaLayout({ summaryData, ...props }) {
  const user = useUser();
  const router = useRouter();
  const { modules } = useChainSettings();
  const chain = useChain();

  return (
    <ListLayout
      titleExtra={<TitleExtra />}
      summary={<Gov2Summary summary={summaryData} />}
      summaryFooter={<Gov2SummaryFooter />}
      headContent={<HeadContent />}
      description="All active and history referenda of various tracks."
      tabs={[
        {
          value: "referenda",
          label: "Referenda",
          url: "/referenda",
        },
        {
          value: "tracks",
          label: "Tracks Stats",
          url: "/referenda/tracks",
        },
        user?.address && {
          value: "my_votes",
          label: "My Votes",
          url: "/referenda/votes",
        },
        {
          value: "statistics",
          label: "Statistics",
          url: "/referenda/statistics",
        },
        [Chains.kusama, Chains.polkadot].includes(chain) && {
          value: "dv",
          label: (
            <DvLabel
              label="DV"
              active={router.pathname.startsWith("/referenda/dv")}
            />
          ),
          url: "/referenda/dv",
        },
        modules.whales && {
          value: "whales",
          label: "Whales",
          url: "/referenda/whales",
          active: router.pathname.startsWith("/referenda/whales"),
        },
      ].filter(Boolean)}
      {...props}
    >
      {props.children}
    </ListLayout>
  );
}
