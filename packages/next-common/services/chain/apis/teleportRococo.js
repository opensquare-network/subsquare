import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { useState } from "react";

const targetParachainId = 1000;
const recipientId = "xx";
const wsEndpoint = "wss://rococo-rpc.polkadot.io";

export function useTeleportRococo() {
  const [status, setStatus] = useState("");

  const teleport = async (senderUri, amount) => {
    setStatus("Connecting to Rococo network...");
    const wsProvider = new WsProvider(wsEndpoint);
    const api = await ApiPromise.create({ provider: wsProvider });
    setStatus("Connected to Rococo network.");

    const keyring = new Keyring({ type: "sr25519" });
    const sender = keyring.addFromUri(senderUri); // Using Alice for testing, replace with actual sender URI

    try {
      const teleportTx = api.tx.xcmPallet.teleportAssets(
        {
          V2: {
            // Assuming V2 is the correct version
            parents: 0,
            interior: {
              X1: { Parachain: targetParachainId },
            },
          },
        },
        {
          V2: {
            interior: {
              X1: {
                AccountId32: {
                  id: api.createType("AccountId32", recipientId).toU8a(),
                  network: "Any",
                },
              },
            },
            parents: 0,
          },
        },
        [
          {
            id: {
              Concrete: {
                parents: 0,
                interior: { Here: {} },
              },
            },
            fun: {
              Fungible: amount,
            },
          },
        ],
        0, // Fee index
      );

      setStatus("Teleport transaction created.");
      console.log("Teleport transaction created:", teleportTx.toHuman());

      await teleportTx.signAndSend(sender, ({ status }) => {
        if (status.isInBlock) {
          setStatus(
            `Transaction included in block ${status.asInBlock.toString()}`,
          );
        } else if (status.isFinalized) {
          setStatus(
            `Transaction finalized in block ${status.asFinalized.toString()}`,
          );
        }
      });
    } catch (error) {
      console.error("An error occurred during teleportation:", error);
      setStatus(`Error during teleportation: ${error.message}`);
    }
  };

  return { teleport, status };
}
