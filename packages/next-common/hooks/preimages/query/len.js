import { isNil } from "lodash-es";

async function queryPreimageLenFromStatusFor(blockApi, hash) {
  const rawStatus = await blockApi.query.preimage.statusFor(hash);
  if (!rawStatus.isSome) {
    return null;
  }

  const status = rawStatus.unwrap();
  if (status.isRequested) {
    const requestedValue = status.asRequested;
    const optionLen = requestedValue.len;
    if (optionLen.isSome) {
      return optionLen.unwrap().toNumber();
    }
  } else if (status.isUnrequested) {
    return status.asUnrequested.len.toNumber();
  }

  return null;
}

async function queryPreimageLenFromRequestStatusFor(blockApi, hash) {
  const rawStatus = await blockApi.query.preimage.requestStatusFor(hash);
  if (!rawStatus.isSome) {
    return null;
  }

  const status = rawStatus.unwrap();
  if (status.isRequested) {
    const requestedValue = status.asRequested;
    const maybeLen = requestedValue.maybeLen;
    if (maybeLen.isSome) {
      return maybeLen.unwrap().toNumber();
    }
  } else if (status.isUnrequested) {
    return status.asUnrequested.len.toNumber();
  }

  return null;
}

export default async function queryPreimageLen(blockApi, hash) {
  let maybeLen;
  if (blockApi.query.preimage?.statusFor) {
    maybeLen = await queryPreimageLenFromStatusFor(blockApi, hash);
  }
  if (!isNil(maybeLen)) {
    return maybeLen;
  }

  if (blockApi.query.preimage?.requestStatusFor) {
    maybeLen = await queryPreimageLenFromRequestStatusFor(blockApi, hash);
  }
  if (!isNil(maybeLen)) {
    return maybeLen;
  }

  return null;
}
