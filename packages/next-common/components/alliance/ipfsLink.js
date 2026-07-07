import ExternalLink from "../externalLink";
import getStorageLink from "../../utils/env/storageLink";

export default function IpfsLink({ cid }) {
  return (
    <ExternalLink
      className="text12Medium"
      title={cid}
      href={getStorageLink(cid)}
    >
      IPFS
    </ExternalLink>
  );
}
