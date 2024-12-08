import { useChainSettings } from "next-common/context/chain";
import { useUser } from "next-common/context/user";
import AccountInfo from "../overview/accountInfo";
import { useFetchMyDepositsData } from "next-common/hooks/account/deposit";
import BaseLayout from "./baseLayout";
import { cn } from "next-common/utils";
import NoWalletConnected from "../noWalletConnected";

export default function AccountLayout(props) {
  useFetchMyDepositsData();

  const chainSettings = useChainSettings();
  const user = useUser();

  return (
    <BaseLayout
      title={chainSettings.name}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      {...props}
    >
      {!user?.address ? (
        <div className="h-full flex items-center justify-center">
          <NoWalletConnected text="Connect wallet to participate in on-chain governance." />
        </div>
      ) : (
        <AccountImpl {...props} />
      )}
    </BaseLayout>
  );
}

function AccountImpl(props) {
  return (
    <div className="flex-1">
      <div className={cn("px-6 py-6 mx-auto max-w-[1200px]", "max-sm:px-0")}>
        <div className="mb-6">
          <AccountInfo />
        </div>

        {props.children}
      </div>
    </div>
  );
}
