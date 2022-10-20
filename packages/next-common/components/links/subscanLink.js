import LinkSubScanIcon from "../../assets/imgs/icons/link-subscan.svg";
import LinkSubScanIconActive from "../../assets/imgs/icons/link-subscan-active.svg";
import ThirdPartyLink from "./thirdPartyLink";
import { useChain } from "../../context/chain";

function SubScanLink({ address, indexer }) {
  const chain = useChain();
  
  return <ThirdPartyLink
    href={
      address
        ? `https://${chain}.subscan.io/account/${address}`
        : `https://${chain}.subscan.io/extrinsic/${indexer.blockHeight}-${
          indexer.extrinsicIndex ?? indexer.index ?? 0
        }`
    }
    target="_blank"
    rel="noreferrer"
  >
    <LinkSubScanIcon/>
    <LinkSubScanIconActive/>
  </ThirdPartyLink>
}

export default SubScanLink;
