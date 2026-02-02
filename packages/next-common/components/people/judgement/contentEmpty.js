import Account from "next-common/components/account";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { InfoMessage } from "next-common/components/setting/styled";

export default function ContentEmpty() {
  const address = useRealAddress();
  return (
    <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex flex-col gap-2">
      <div>
        <div className="pb-3 flex gap-2">
          <Account account={{ address }} addressClassName="!text14Medium" />
        </div>
      </div>
      <InfoMessage>
        You have no identity social account verifications.
      </InfoMessage>
    </div>
  );
}
