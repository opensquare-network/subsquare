import { SystemVoice } from "@osn/icons/subsquare";
import { includes } from "lodash-es";
import { useChain } from "next-common/context/chain";
import getDvAddresses from "next-common/utils/dv";
import ExternalLink from "../externalLink";
import Tooltip from "../tooltip";
import AddressUser from "./addressUser";

const WIKI_PAGE = "https://wiki.polkadot.network/docs/decentralized-voices";

/**
 * @param {Parameters<typeof AddressUser>[0]} props
 */
export default function AddressUserWithDVTag(props = {}) {
  const chain = useChain();
  const dvAddress = getDvAddresses(chain);
  const isDV = includes(dvAddress, props.add);

  let { maxWidth } = props;
  if (isDV) {
    if (maxWidth) {
      // icon(20) + gap(8)
      maxWidth -= 28;
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <AddressUser {...props} maxWidth={maxWidth} />
      {isDV && (
        <Tooltip
          content={
            <ExternalLink
              className="text-textPrimaryContrast text12Medium"
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
