import ExternalLink from "../externalLink";
import getIpfsLink from "../../utils/env/ipfsEndpoint";

export default function IpfsLink({ cid }) {
  return (
    <ExternalLink className="text12Medium" title={cid} href={getIpfsLink(cid)}>
      IPFS
    </ExternalLink>
  );
}
