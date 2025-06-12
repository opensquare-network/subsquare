import EvidenceContent from "./content";
import EvidenceComment from "./comment";
import Popup from "next-common/components/popup/wrapper/Popup";
import Divider from "next-common/components/styled/layout/divider";

export default function EvidenceDetailPopup({
  address,
  rank,
  wish,
  evidence,
  onClose,
}) {
  return (
    <Popup
      title={"Evidence Detail"}
      className="h-full w-full !m-0 space-y-0 p-0 !rounded-none flex flex-col !shadow-none !border-none"
      headerClass="p-6 border-b border-neutral300"
      onClose={onClose}
    >
      <main className=" w-full h-full overflow-y-auto sm:overflow-y-hidden  flex flex-col sm:flex-row ">
        <section className="flex-1 flex-grow-[2] flex-shrink-0 md:min-w-[418px] p-6  sm:overflow-y-auto">
          <EvidenceContent
            address={address}
            rank={rank}
            wish={wish}
            evidence={evidence}
          />
        </section>
        <Divider className="hidden sm:block !h-full w-[1px]" />
        <EvidenceComment evidence={evidence} />
      </main>
    </Popup>
  );
}
