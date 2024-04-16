import { SystemVoice } from "@osn/icons/subsquare";
import { includes } from "lodash-es";
import ExternalLink from "next-common/components/externalLink";
import Tooltip from "next-common/components/tooltip";
import AddressUser from "next-common/components/user/addressUser";
import { useChain } from "next-common/context/chain";
import getDvAddresses from "next-common/utils/dv";

const WIKI_PAGE =
  "https://wiki.polkadot.network/docs/decentralized-voices#:~:text=The%20Decentralized%20Voices%20program%20for,Million%20DOT%20of%20voting%20power.";

function Address({ data }) {
  const chain = useChain();
  const dvAddress = getDvAddresses(chain);
  const isDVAddress = includes(dvAddress, data.address);

  let maxWidth = 160;
  if (isDVAddress) {
    // 160 - icon(20) - gap(8)
    maxWidth = 132;
  }

  return (
    <div className="flex items-center gap-x-2">
      <AddressUser maxWidth={maxWidth} linkToVotesPage add={data.address} />
      {isDVAddress && (
        <Tooltip
          content={
            <ExternalLink
              className="text-textPrimaryContrast"
              href={WIKI_PAGE}
              externalIcon={false}
            >
              <span className="underline">Decentralized Voices</span>
              <span> ↗</span>
            </ExternalLink>
          }
        >
          <SystemVoice className="w-5 h-5" />
        </Tooltip>
      )}
    </div>
  );
}

export const addressCol = {
  name: "Address",
  className: "min-w-[160px]",
  cellRender(data) {
    return <Address data={data} />;
  },
};
