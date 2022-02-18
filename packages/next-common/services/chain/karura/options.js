import {
  rpc as acalaRpc,
  typesAlias as acalaTypesAlias,
  typesBundle as acalaTypesBundle,
  signedExtensions as acalaSignedExtensions,
} from "@acala-network/types";
import { derive as ormlDerives } from "@open-web3/orml-api-derive";
import { derive as acalaDerives } from "@acala-network/api-derive";

export default {
  rpc: {
    ...acalaRpc,
  },
  typesAlias: {
    ...acalaTypesAlias,
  },
  typesBundle: {
    spec: {
      acala: {
        ...acalaTypesBundle?.spec?.acala,
      },
      mandala: {
        ...acalaTypesBundle?.spec?.mandala,
      },
      karura: {
        ...acalaTypesBundle?.spec?.karura,
      },
    },
  },
  signedExtensions: {
    ...acalaSignedExtensions,
  },
  derives: {
    ...ormlDerives,
    ...acalaDerives,
  },
};
