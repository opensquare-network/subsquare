import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import { useReferendaPallet } from "next-common/context/referenda/pallet";
import { useMemo } from "react";
import { isHex, hexToString } from "@polkadot/util";
import { trimEnd } from "lodash-es";

function normalizeName(name) {
  let value = name;
  if (isHex(name)) {
    value = trimEnd(value, "0");
    value = hexToString(value);
  }

  return (value || "").toLowerCase().split(" ").join("_");
}

function normalizeTrackInfo(track = {}) {
  return Object.entries(track).reduce((result, [name, value]) => {
    if (name === "decisionDeposit") {
      result[name] = new BigNumber(value).toString();
    } else if (name === "name") {
      result[name] = normalizeName(value || "");
      result.originalName = value;
    } else {
      result[name] = value;
    }

    return result;
  }, {});
}

export default function useOnChainReferendaTracks() {
  const api = useContextApi();
  const pallet = useReferendaPallet();

  const tracks = useMemo(() => {
    if (!api) {
      return [];
    }

    return (api?.consts[pallet]?.tracks || []).map((track) => {
      if (Array.isArray(track)) {
        const [id, detail] = track;
        return {
          id: id.toNumber(),
          ...detail.toJSON(),
        };
      } else if (track.id && track.info) {
        return {
          id: track.id.toNumber(),
          ...normalizeTrackInfo(track.info.toJSON()),
        };
      }
    });
  }, [api, pallet]);

  return {
    tracks,
    isLoading: !api,
  };
}
