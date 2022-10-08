import io from "socket.io-client";
import { setNodeBlockHeight } from "../store/reducers/nodeSlice";

const chainStatusRoom = "CHAIN_STATUS_ROOM";

export let socket = null;

export function connect(store) {
  if (socket) {
    socket.emit("unsubscribe", chainStatusRoom);
    socket.disconnect();
  }

  const socketUrl = new URL(`/`, process.env.NEXT_PUBLIC_API_END_POINT).href;
  socket = io(socketUrl);
  socket.connect();

  socket.on("connect", () => {
    socket.emit("subscribe", chainStatusRoom);

    socket.on("scanStatus", ({ height }) => {
      store.dispatch(setNodeBlockHeight(height));
    });
  });
}
