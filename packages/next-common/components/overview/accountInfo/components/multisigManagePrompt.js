import Prompt from "./prompt";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useMemo, useEffect } from "react";
import Link from "next/link";
import { useChain } from "next-common/context/chain";
import {
  fetchMyMultisigsCount,
  fetchMyMultisigs,
  myMultisigsCountSelector,
} from "next-common/store/reducers/multisigSlice";
import { useDispatch, useSelector } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import getChainSettings from "next-common/utils/consts/settings";
import { usePathname } from "next/navigation";
import { myMultisigsSelector } from "next-common/store/reducers/multisigSlice";

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

export default function MultisigManagePrompt() {
  const dispatch = useDispatch();
  const chain = useChain();
  const realAddress = useRealAddress();
  const myMultisigsCount = useSelector(myMultisigsCountSelector) || 0;
  const myMultisigs = useSelector(myMultisigsSelector);
  const { items: multisigs = [], total = 0 } = myMultisigs || {};
  const pathname = usePathname();

  const isAccountMultisigPage = pathname.startsWith("/account/multisigs");

  const settings = getChainSettings(chain);

  const needApprovalCount = useMemo(() => {
    if (total === 0) {
      return 0;
    }

    return getNeedApprovalCount(multisigs, realAddress);
  }, [multisigs, realAddress, total]);

  useEffect(() => {
    if (settings?.multisigApiPrefix && realAddress) {
      dispatch(fetchMyMultisigsCount(chain, realAddress));

      if (!isAccountMultisigPage) {
        dispatch(fetchMyMultisigs(chain, realAddress));
      }
    }
  }, [dispatch, chain, realAddress, settings, isAccountMultisigPage]);

  const promptContent = useMemo(() => {
    if (!settings?.multisigApiPrefix || myMultisigsCount === 0) {
      return null;
    }

    const manageContent = myMultisigsCount > 1 ? "them" : "it";
    const transactionContent = myMultisigsCount > 1 ? "multisigs" : "multisig";

    return (
      <Prompt
        cacheKey={CACHE_KEY.multisigPromptVisible}
        type={PromptTypes.NEUTRAL}
      >
        You have {myMultisigsCount} active {transactionContent}, &nbsp;
        {needApprovalCount} of &nbsp;
        {manageContent} need your approval.
        {!isAccountMultisigPage && <ManageLink manageContent={manageContent} />}
      </Prompt>
    );
  }, [myMultisigsCount, needApprovalCount, settings, isAccountMultisigPage]);

  return promptContent;
}
