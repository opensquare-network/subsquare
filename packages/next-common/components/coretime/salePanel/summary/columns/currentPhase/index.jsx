import PhaseItem from "next-common/components/coretime/salePanel/summary/phase";
import MaybeInterludeEnd from "./interlude";
import MaybeLeadinEnd from "next-common/components/coretime/salePanel/summary/columns/currentPhase/leadin";
import MaybeFixedPriceEnd from "next-common/components/coretime/salePanel/summary/columns/currentPhase/fixedPrice";

export default function CurrentPhase() {
  return (
    <div className="space-y-1">
      <PhaseItem />
      <>
        <MaybeInterludeEnd />
        <MaybeLeadinEnd />
        <MaybeFixedPriceEnd />
      </>
    </div>
  );
}
