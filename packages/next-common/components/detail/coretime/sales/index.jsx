import CoretimeSalePanel from "next-common/components/coretime/salePanel";
import CoretimeSalesHistorySection from "next-common/components/coretime/salesHistorySection";

// TODO: fetch target sale detail by data?.id.
export default function CoretimeSalesDetail() {
  return (
    <div className="space-y-6">
      <CoretimeSalePanel />
      <CoretimeSalesHistorySection />
    </div>
  );
}
