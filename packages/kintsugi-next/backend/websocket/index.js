const { chainStatusRoom } = require("../constants");
const { feedScanStatus } = require("./status");
const { getScanHeight } = require("./store");
const i18n = require("../middleware/i18n");

async function listenAndEmitInfo(io) {
  io.on("connection", (socket) => {
    console.log(`socket client ${socket.id} connected`);
    socket.use(i18n);

    socket.on("subscribe", (room) => {
      socket.join(room);

      if (room === chainStatusRoom) {
        const scanHeight = getScanHeight();
        io.to(room).emit("scanStatus", { height: scanHeight });
      }
    });

    socket.on("disconnect", () => {
      console.log(`socket client ${socket.id} disconnect`);
    });
  });

  await feedScanStatus(io);
}

function ioHandler(io) {
  listenAndEmitInfo(io);
}

module.exports = {
  ioHandler,
};
