import { useCallback, useEffect } from "react";
import { useSocket } from "next-common/context/socket";
import { store } from "../store";
import { setNodeBlockHeight } from "../store/reducers/nodeSlice";
import { useChainSettings } from "next-common/context/chain";

const chainStatusRoom = "CHAIN_STATUS_ROOM";
let lastUpdateAt = 0;

export default function ScanStatusComponent({ children }) {
  const socket = useSocket();
  const { blockTime } = useChainSettings();

  const onScanStatus = useCallback(
    ({ height }) => {
      const now = new Date().getTime();
      const threshold = blockTime || 6000;

      if (now - lastUpdateAt >= threshold) {
        store.dispatch(setNodeBlockHeight(height));
        lastUpdateAt = now;
      }
    },
    [blockTime],
  );

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit("subscribe", chainStatusRoom);
    socket.on("scanStatus", onScanStatus);

    return () => {
      socket.emit("unsubscribe", chainStatusRoom);
      socket.off("scanStatus", onScanStatus);
    };
  }, [socket, onScanStatus]);

  return children;
}
