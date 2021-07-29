async function listenAndEmitInfo(io, chain) {
  io.on("connection", (socket) => {
    console.log(`${chain}: socket client ${socket.id} connected`);
    socket.on("disconnect", () => {
      console.log(`${chain}: socket client ${socket.id} disconnect`);
    })
  });
}

function ioHandler(io) {
  [].forEach((chain) => {
    listenAndEmitInfo(io.of(`/${chain}`), chain);
  });
}

module.exports = {
  ioHandler,
};
