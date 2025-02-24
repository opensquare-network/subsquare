import queryPreimageLen from "next-common/hooks/preimages/query/len";
import { isNil } from "lodash-es";

async function queryPreimageByLen(blockApi, hash, len) {
  const optionalRaw = await blockApi.query.preimage.preimageFor([hash, len]);
  return optionalRaw.isSome ? optionalRaw.unwrap() : null;
}

async function queryFromPreimageFor(blockApi, toQueryHash) {
  const entries = await blockApi.query.preimage.preimageFor.entries();
  for (const [storageKey, rawPreimage] of entries) {
    const key = storageKey.args[0];
    const hash = key[0].toString();
    if (hash === toQueryHash) {
      return rawPreimage.unwrap();
    }
  }

  return null;
}

export default async function queryPreimageAtBlock(api, preimageHash) {
  const len = await queryPreimageLen(api, preimageHash);
  if (!isNil(len)) {
    return await queryPreimageByLen(api, preimageHash, len);
  }

  return await queryFromPreimageFor(api, preimageHash);
}
