import SummaryItem from "next-common/components/summary/layout/item";
import useCoretimeSalePhase from "next-common/context/coretime/hooks/useCoretimeSalePhase";
import FieldLoading from "next-common/components/icons/fieldLoading";

export default function PhaseItem() {
  const {phase, isLoading} = useCoretimeSalePhase();

  return (
      <SummaryItem title="Current Phase">
        <div>{isLoading ? <FieldLoading/> : phase}</div>
      </SummaryItem>
    )
}
