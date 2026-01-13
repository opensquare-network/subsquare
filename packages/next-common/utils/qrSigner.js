import { blake2AsU8a } from "@polkadot/util-crypto";

export class QrSigner {
  #registry;
  #setState;
  #currentResolve = null;
  #currentReject = null;

  constructor(registry, setState) {
    this.#registry = registry;
    this.#setState = setState;
  }

  async signPayload(payload) {
    if (this.#currentResolve || this.#currentReject) {
      this.#currentReject?.(new Error("New signing request started"));
      this.#clear();
    }
    return new Promise((resolve, reject) => {
      this.#currentResolve = resolve;
      this.#currentReject = reject;

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
      });
    });
  }

  resolveSignature(result) {
    if (this.#currentResolve) {
      this.#currentResolve(result);
      this.#clear();
    }
  }

  rejectSignature(error) {
    if (this.#currentReject) {
      this.#currentReject(error);
      this.#clear();
    }
  }

  #clear() {
    this.#currentResolve = null;
    this.#currentReject = null;
  }
}
