import queryPreimageAtBlock from "next-common/hooks/preimages/query";
import nextApi from "next-common/services/nextApi";
import { parsePreImageCall } from "next-common/components/proposal/preImage";

async function getHexByRestful(hash) {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15 * 1000);

  const { result, error } = await nextApi.fetch(
    `preimages/${hash}`,
    {},
    { signal: abortController.signal },
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
    hex = call.toHex();
  }

  if (hex) {
    return parsePreImageCall(hex, api);
  }

  return null;
}
