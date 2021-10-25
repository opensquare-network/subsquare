import io from "socket.io-client";

import { store } from "../store";
import { setNodeBlockHeight } from "../store/reducers/nodeSlice";

const chainStatusRoom = "CHAIN_STATUS_ROOM";

export let socket = null;

export function connect(chain) {
  if (socket) {
    socket.emit("unsubscribe", chainStatusRoom);
    socket.disconnect();
  }

  const socketUrl = new URL(`/${chain}`, process.env.NEXT_PUBLIC_API_END_POINT)
    .href;
  socket = io(socketUrl);
  socket.connect();

  socket.on("connect", () => {
    socket.emit("subscribe", chainStatusRoom);

    socket.on("scanStatus", ({ height }) => {
      store.dispatch(setNodeBlockHeight({ chain, height }));
    });
  });
}
