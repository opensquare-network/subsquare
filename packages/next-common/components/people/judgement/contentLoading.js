import Loading from "next-common/components/loading";
import Account from "next-common/components/account";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";

export default function ContentLoading() {
  const address = useRealAddress();

  return (
    <>
      <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex flex-col gap-2">
        <div>
          <div className="pb-3 flex gap-2">
            <Account account={{ address }} addressClassName="!text14Medium" />
          </div>
          <SummaryLayout className="grid-cols-3">
            <SummaryItem title="Verified">
              <LoadableContent isLoading={true} />
            </SummaryItem>
            <SummaryItem title="Pending">
              <LoadableContent isLoading={true} />
            </SummaryItem>
          </SummaryLayout>
        </div>
      </div>
      <div className="pt-4 grid grid-cols-1 gap-4 text-textPrimary">
        <div className="p-4 flex justify-center">
          <Loading size="24" />
        </div>
      </div>
    </>
  );
}
