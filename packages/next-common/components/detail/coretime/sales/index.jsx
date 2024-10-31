import CoretimeSalePanel from "next-common/components/coretime/salePanel";
import CoretimeSalesHistorySection from "next-common/components/coretime/salesHistorySection";

// TODO: add CoretimeDetailSaleSummary
export default function CoretimeSalesDetail() {
  return (
    <div className="space-y-6">
      <CoretimeSalePanel />
      <CoretimeSalesHistorySection />
    </div>
  );
}
