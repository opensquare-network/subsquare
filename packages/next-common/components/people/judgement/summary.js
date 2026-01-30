import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Account from "next-common/components/account";
import LoadableContent from "next-common/components/common/loadableContent";
import { InfoMessage } from "next-common/components/setting/styled";

export default function JudgementSummary({ verified, pending, loading }) {
  const address = useRealAddress();

  return (
    <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex flex-col gap-2">
      <div>
        <div className="pb-3 flex gap-2">
          <Account account={{ address }} addressClassName="!text14Medium" />
        </div>
        <SummaryLayout className="grid-cols-3">
          <SummaryItem title="Verified">
            <LoadableContent isLoading={loading}>
              <span>{verified}</span>
            </LoadableContent>
          </SummaryItem>
          <SummaryItem title="Pending">
            <LoadableContent isLoading={loading}>
              <span>{pending}</span>
            </LoadableContent>
          </SummaryItem>
        </SummaryLayout>
      </div>
      {!loading && pending === 0 && (
        <InfoMessage>
          All social account verifications are done. Our registrar will do a
          final check and give the judgement soon.
        </InfoMessage>
      )}
    </div>
  );
}
