import CommonNotification from "./common";
import { CACHE_KEY } from "next-common/utils/constants";
import { useMemo } from "react";
import Link from "next/link";
import { myMultisigsCountSelector } from "next-common/store/reducers/multisigSlice";
import { useSelector } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
import { usePathname } from "next/navigation";
import { myMultisigsSelector } from "next-common/store/reducers/multisigSlice";
import useSubscribeMyActiveMultisigs from "next-common/components/overview/accountInfo/hook/useSubscribeMyActiveMultisigs";

const getNeedApprovalCount = (multisigs, address) => {
  const needApprovalItems = multisigs?.filter((item) => {
    return (
      item.state?.name === "Approving" && !item?.approvals.includes(address)
    );
  });

  return needApprovalItems?.length || 0;
};

function ManageLink({ manageContent }) {
  return (
    <>
      &nbsp;Manage&nbsp;{manageContent}&nbsp;
      <Link className="underline" href={"/account/multisigs"}>
        here
      </Link>
    </>
  );
}

export default function MultisigManageNotification() {
  const realAddress = useRealAddress();
  const myMultisigsCount = useSelector(myMultisigsCountSelector) || 0;
  const myMultisigs = useSelector(myMultisigsSelector);
  const chainSettings = useChainSettings();
  const { items: multisigs = [], total = 0 } = myMultisigs || {};
  const pathname = usePathname();
  const isAccountMultisigPage = pathname.startsWith("/account/multisigs");

  useSubscribeMyActiveMultisigs(isAccountMultisigPage);

  const needApprovalCount = useMemo(() => {
    if (total === 0) {
      return 0;
    }

    return getNeedApprovalCount(multisigs, realAddress);
  }, [multisigs, realAddress, total]);

  const promptContent = useMemo(() => {
    if (!chainSettings?.multisigApiPrefix || myMultisigsCount === 0) {
      return null;
    }

    const manageContent = myMultisigsCount > 1 ? "them" : "it";
    const transactionContent = myMultisigsCount > 1 ? "multisigs" : "multisig";

    return (
      <CommonNotification
        cacheKey={CACHE_KEY.multisigPromptVisible}
        className={"bg-theme500"}
      >
        You have {myMultisigsCount} active {transactionContent}, &nbsp;
        {needApprovalCount} of &nbsp;
        {manageContent} need your approval.
        {!isAccountMultisigPage && <ManageLink manageContent={manageContent} />}
      </CommonNotification>
    );
  }, [
    myMultisigsCount,
    needApprovalCount,
    chainSettings,
    isAccountMultisigPage,
  ]);

  return promptContent;
}
