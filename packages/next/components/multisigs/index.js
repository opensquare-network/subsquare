import AccountInfo from "next-common/components/overview/accountInfo";
import { AccountSubTabs } from "components/overview/account/subTabs";
import MultisigsList from "./multisigsList";
import { useEffect } from "react";
import { useUser } from "next-common/context/user";
import { fetchMyMultisigs } from "next-common/store/reducers/multisigSlice";
import { useChain } from "next-common/context/chain";
import { useDispatch } from "react-redux";

export default function Multisigs() {
  const user = useUser();
  const chain = useChain();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchMyMultisigs(
        chain,
        "13fnouKsAaWxBxCx9VarXBNyYo7vUCeTUbRmQBjytju8YqqB",
        1,
      ),
    );
  }, [dispatch, chain, user]);

  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink />

      <div className="flex flex-col gap-[16px]">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-[12px]">
          <AccountSubTabs />
        </div>
        <MultisigsList />
      </div>
    </div>
  );
}
