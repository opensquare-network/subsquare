import { blake2AsU8a } from "@polkadot/util-crypto";

export class QrSigner {
  #registry;
  #setState;

  constructor(registry, setState) {
    this.#registry = registry;
    this.#setState = setState;
  }

  async signPayload(payload) {
    console.log("payload", payload);
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
        qrReject: reject,
        qrResolve: resolve,
      });
    });
  }
}
