import TracksStatusPanel from "./tracksStatusPanel";

export default function TracksStatus() {
  return (
    <div className="flex flex-col">
      <span className="ml-[24px] mb-[16px] text16Bold text-textPrimary">
        Tracks
        {/* fixme: fix following line magic number, we should use real tracks number */}
        <span className="text16Medium text-textTertiary">16</span>
      </span>
      <TracksStatusPanel />
    </div>
  );
}
