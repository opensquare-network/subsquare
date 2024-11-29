import { noop } from "lodash-es";

export function getDispatchError(dispatchError) {
  let message = dispatchError.type;

  if (dispatchError.isModule) {
    try {
      const mod = dispatchError.asModule;
      const error = dispatchError.registry.findMetaError(mod);

      message = `${error.section}.${error.name}`;
    } catch (error) {
      // swallow
    }
  } else if (dispatchError.isToken) {
    message = `${dispatchError.type}.${dispatchError.asToken.type}`;
  }

  return message;
}

function handleExtrinsicFailure(status, events, onError = noop) {
  if (!status.isInBlock && !status.isFinalized) {
    return false;
  }

  const failedEvent = events.find(
    (e) => e.event.section === "system" && e.event.method === "ExtrinsicFailed",
  );
  if (failedEvent) {
    const [dispatchError] = failedEvent.event.data;
    const message = getDispatchError(dispatchError);
    onError(new Error(`Extrinsic failed: ${message}`));
    return true;
  }

  const proxyExecutedEvent = events.find(
    (e) => e.event.section === "proxy" && e.event.method === "ProxyExecuted",
  );
  if (proxyExecutedEvent) {
    const [result] = proxyExecutedEvent.event.data;
    if (result.isErr) {
      const message = getDispatchError(result.asErr);
      onError(new Error(`Extrinsic failed: ${message}`));
      return true;
    }
  }

  return false;
}

export function createSendTxEventHandler({
  onFinalized = noop,
  onInBlock = noop,
  onError = noop,
  unsub = noop,
}) {
  let blockHash = null;

  return ({ events = [], status }) => {
    if (status.isFinalized) {
      onFinalized({ events, blockHash });
      unsub();
      return;
    }

    if (handleExtrinsicFailure(status, events, onError)) {
      unsub();
      return;
    }

    if (status.isInBlock) {
      blockHash = status.asInBlock.toString();
      onInBlock({ events, blockHash });
      return;
    }
  };
}

export async function sendSubstrateTx({
  api,
  tx,
  onStarted = noop,
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onError = noop,
  signerAddress,
}) {
  onStarted();

  try {
    const account = await api.query.system.account(signerAddress);

    const unsub = await tx.signAndSend(
      signerAddress,
      {
        nonce: account.nonce,
        withSignedTransaction: true,
      },
      createSendTxEventHandler({
        onFinalized,
        onInBlock,
        onError,
        unsub: () => unsub(),
      }),
    );

    onSubmitted();
  } catch (e) {
    onError(e);
  }
}
