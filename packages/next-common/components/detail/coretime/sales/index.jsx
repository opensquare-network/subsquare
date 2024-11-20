import CoretimeDetailSalePanel from "./panel";
import CoretimeSalesHistorySection from "next-common/components/coretime/salesHistorySection";

export default function CoretimeSalesDetail() {
  return (
    <div className="space-y-6">
      <CoretimeDetailSalePanel />
      <CoretimeSalesHistorySection />
    </div>
  );
}
