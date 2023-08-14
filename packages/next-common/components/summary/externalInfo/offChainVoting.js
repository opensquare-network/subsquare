import Item from "./item";

export default function OffChainVoting() {
  return (
    <div className="flex flex-col gap-[8px]">
      <span className="text-[12px] font-medium leading-[16px]">
        Active off-chain voting
      </span>
      <Item
        title="Sportsgeist P2P-Sportbetting Proposal"
        href="https://voting.opensquare.io"
      />
    </div>
  );
}
