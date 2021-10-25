import io from "socket.io-client";

const chainStatusRoom = "CHAIN_STATUS_ROOM";

export let socket = null;

export function connect(chain) {
  if (socket) {
    socket.emit("unsubscribe", chainStatusRoom);
    socket.disconnect();
  }

  const socketUrl = new URL(`/${chain}`, process.env.NEXT_PUBLIC_API_END_POINT).href;
  socket = io(socketUrl);
  socket.connect();

  socket.on("connect", () => {
    socket.emit("subscribe", chainStatusRoom);

    socket.on("scanStatus", ({ height }) => {
      //TODO: set height to redux store
      console.log(height);
      // store.dispatch(setScanHeight(height));
    });
  });
}
