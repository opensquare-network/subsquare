import TracksStatusPanel from "./tracksStatusPanel";

export default function TracksStatus() {
  return (
    <div className="flex flex-col">
      <span className="ml-[24px] mb-[16px] text16Bold text-textPrimary">
        Tracks <span className="text16Medium text-textTertiary">16</span>
      </span>
      <TracksStatusPanel />
    </div>
  );
}
