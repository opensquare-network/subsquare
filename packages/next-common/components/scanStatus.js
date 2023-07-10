import { useCallback, useEffect } from "react";
import { useSocket } from "next-common/context/socket";
import { store } from "../store";
import { setNodeBlockHeight } from "../store/reducers/nodeSlice";

const chainStatusRoom = "CHAIN_STATUS_ROOM";

export default function ScanStatusComponent({ children }) {
  const socket = useSocket();

  const onScanStatus = useCallback(({ height }) => {
    store.dispatch(setNodeBlockHeight(height));
  }, []);

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
