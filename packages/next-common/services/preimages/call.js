import queryPreimageAtBlock from "next-common/hooks/preimages/query";
import { backendApi } from "next-common/services/nextApi";
import { parsePreImageCall } from "next-common/components/proposal/preImage";

async function getHexByRestful(hash) {
  const { result, error } = await backendApi.fetch(
    `preimages/${hash}`,
    {},
    { timeout: 15 * 1000 },
  );
  if (error) {
    return null;
  }

  return result.hex || result.data;
}

export default async function getCallByPreimageHash(api, hash) {
  let hex = await getHexByRestful(hash);
  if (!hex) {
    const call = await queryPreimageAtBlock(api, hash);
    hex = call ? call.toHex() : null;
  }

  if (hex) {
    return parsePreImageCall(hex, api);
  }

  return null;
}
