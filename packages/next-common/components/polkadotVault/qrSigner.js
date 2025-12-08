import { blake2AsU8a } from "@polkadot/util-crypto";

export class QrSigner {
  #registry;
  #setState;

  constructor(registry, setState) {
    this.#registry = registry;
    this.#setState = setState;
  }

  async signPayload(payload) {
    return new Promise((resolve, reject) => {
      const isQrHashed = payload.method.length > 5000;
      const wrapper = this.#registry.createType("ExtrinsicPayload", payload, {
        version: payload.version,
      });
      const qrPayload = isQrHashed
        ? blake2AsU8a(wrapper.toU8a(true))
        : wrapper.toU8a();

      this.#setState({
        isQrHashed,
        qrAddress: payload.address,
        qrPayload,
        qrResolve: resolve,
        qrReject: reject,
      });
    });
  }
}

import { useState, useCallback } from "react";
export function useVaultSigner(registry) {
  const [qrState, setQrState] = useState(null);

  const signer = new QrSigner(registry, setQrState);

  const submitSignature = useCallback(
    (signature) => {
      if (qrState?.qrResolve) {
        qrState.qrResolve({ signature, ...qrState });
        setQrState(null);
      }
    },
    [qrState],
  );

  const cancelSignature = useCallback(
    (error) => {
      if (qrState?.qrReject) {
        qrState.qrReject(error);
        setQrState(null);
      }
    },
    [qrState],
  );

  return { signer, qrState, submitSignature, cancelSignature };
}
