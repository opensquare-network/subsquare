import { u8aToString } from "@polkadot/util";
import { useAsync } from "react-use";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import queryPreimageAtBlock from "next-common/hooks/preimages/query";

export default function useMultiAssetBountiesMetadata(call = {}) {
  const api = useConditionalContextApi();
  const { section, method, args = [] } = call;
  const isFundBounty =
    section === "multiAssetBounties" && method === "fundBounty";
  const metadataHash = args.find((item) => item?.name === "metadata")?.value;

  const { value: metadata } = useAsync(async () => {
    if (!api || !isFundBounty || !metadataHash) {
      return null;
    }

    const rawMetadata = await queryPreimageAtBlock(api, metadataHash);
    if (!rawMetadata) {
      return null;
    }

    return u8aToString(rawMetadata);
  }, [api, isFundBounty, metadataHash]);

  if (!metadata) {
    return [];
  }

  return [
    [
      "Bounty Description",
      <span key="multi-asset-bounties-metadata" className="text14Medium">
        {metadata}
      </span>,
    ],
  ];
}
