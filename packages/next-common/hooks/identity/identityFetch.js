import { hexToString } from "@polkadot/util";

export const InitIdentityInfo = {
  display: null,
  legal: null,
  email: null,
  matrix: null,
  web: null,
  twitter: null,
  github: null,
  discord: null,
};

export const InitIdentityJudgements = [];

export const defaultIdentityOfData = {
  info: InitIdentityInfo,
  judgements: InitIdentityJudgements,
};

export async function fetchIdentityOf(api, address) {
  if (api?.query?.identity?.identityOf && address) {
    const apiResult = await api.query.identity.identityOf(address);
    if (apiResult && !apiResult.isNone) {
      return convertIdentity(apiResult);
    }
  }

  return defaultIdentityOfData;
}

export function convertIdentity(identity) {
  const unwrapped = identity.unwrap();
  const identityOf = Array.isArray(unwrapped) ? unwrapped[0] : unwrapped;
  const judgements = convertJudgements(identityOf);
  const { info } = identityOf.toJSON();
  return {
    info: {
      display: hexToString(info.display.raw),
      legal: hexToString(info.legal.raw),
      email: hexToString(info.email.raw),
      matrix: hexToString(info.matrix.raw),
      web: hexToString(info.web.raw),
      twitter: hexToString(info.twitter.raw),
      github: hexToString(info.github.raw),
      discord: hexToString(info.discord.raw),
      image: hexToString(info.image.raw),
    },
    judgements,
  };
}

export function convertJudgements(identityOf) {
  const judgements = identityOf?.judgements?.toHuman() || [];
  if (!judgements || judgements.length === 0) {
    return [];
  }

  return judgements?.map((judgement) => {
    const [index, statusField] = judgement;
    const isFeePaid =
      typeof statusField === "object" &&
      Object.entries(statusField)?.[0]?.[0] === "FeePaid";
    const status = isFeePaid ? "FeePaid" : statusField;
    const fee = isFeePaid ? Object.entries(statusField)?.[0]?.[1] : null;

    return {
      index,
      status,
      fee,
    };
  });
}
