const { SupportChains, chainStatusRoom } = require("../constants");
const { feedScanStatus } = require("./status");
const { getScanHeight } = require("./store");
const i18n = require("../middleware/i18n");

async function listenAndEmitInfo(io, chain) {
  io.on("connection", (socket) => {
    console.log(`${chain}: socket client ${socket.id} connected`);
    socket.use(i18n);

    socket.on("subscribe", (room) => {
      socket.join(room);

      if (room === chainStatusRoom) {
        const scanHeight = getScanHeight(chain);
        io.to(room).emit("scanStatus", { height: scanHeight });
      }
    });

    socket.on("disconnect", () => {
      console.log(`${chain}: socket client ${socket.id} disconnect`);
    })
  });

  await feedScanStatus(io, chain);
}

function ioHandler(io) {
  SupportChains.forEach((chain) => {
    listenAndEmitInfo(io.of(`/${chain}`), chain);
  });
}

module.exports = {
  ioHandler,
};
