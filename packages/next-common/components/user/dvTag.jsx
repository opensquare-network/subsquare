import { SystemVoice } from "@osn/icons/subsquare";
import ExternalLink from "../externalLink";
import Tooltip from "../tooltip";

const WIKI_PAGE = "https://wiki.polkadot.network/docs/decentralized-voices";

export default function AddressDVTag({ showTooltip = true }) {
  return (
    <Tooltip
      content={
        showTooltip && (
          <ExternalLink
            className="text-textPrimaryContrast text12Medium"
            href={WIKI_PAGE}
            externalIcon={false}
          >
            <span className="underline">Decentralized Voices</span>
            <span> ↗</span>
          </ExternalLink>
        )
      }
    >
      <SystemVoice className="w-5 h-5" />
    </Tooltip>
  );
}
