import WithPageWidth from "next-common/components/common/withPageWidth";
import { CallPopupProvider } from "next-common/components/multisigs/context/callPopupContext";
import Loading from "next-common/components/loading";
import MultisigsTabs from "next-common/components/profile/multisigs/tabs";
import ProfileMultisigsDataProvider, {
  useProfileMultisigsDataContext,
} from "next-common/components/profile/multisigs/context/profileMultisigsDataContext";

function ProfileMultisigsImpl() {
  const { loading } = useProfileMultisigsDataContext();
  if (loading) {
    return (
      <div className="flex grow mt-2 justify-center items-center">
        <Loading size={20} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[18px]">
      <MultisigsTabs />
    </div>
  );
}

export default function ProfileMultisigs() {
  return (
    <WithPageWidth>
      <CallPopupProvider>
        <ProfileMultisigsDataProvider>
          <ProfileMultisigsImpl />
        </ProfileMultisigsDataProvider>
      </CallPopupProvider>
    </WithPageWidth>
  );
}
