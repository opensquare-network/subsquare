import Loading from "next-common/components/loading";
import CommonPanel from "next-common/components/profile/bio/commonPanel";

export default function PanelLoading() {
  return (
    <CommonPanel className="relative h-[116px]">
      <div className="flex flex-1 items-center justify-center">
        <Loading size={20} />
      </div>
    </CommonPanel>
  );
}
