import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";

export const ayeNayCol = {
  name: "Aye/Nay",
  width: 200,
  className: "text-right",
  cellRender(data) {
    return (
      <div className="inline-flex items-center">
        <span className="w-12 mr-2 text-right">{data.ayeCount}</span>
        <SystemVoteAye className="inline w-5 h-5" />
        <span className="w-12 mr-2 text-right">{data.nayCount}</span>
        <SystemVoteNay className="inline w-5 h-5" />
      </div>
    );
  },
};
