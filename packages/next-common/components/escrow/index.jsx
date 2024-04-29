import Current from "./current";
import History from "./history";

export default function Escrow() {
  return (
    <div className="flex flex-col gap-[26px]">
      <Current />
      <History />
    </div>
  );
}
