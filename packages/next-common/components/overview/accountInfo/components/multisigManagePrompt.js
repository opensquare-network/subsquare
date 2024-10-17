import Prompt from "./prompt";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useMemo, useEffect } from "react";
import Link from "next/link";
import { useChain } from "next-common/context/chain";
import {
  fetchMyMultisigsCount,
  myMultisigsCountSelector,
} from "next-common/store/reducers/multisigSlice";
import { useDispatch, useSelector } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

function PromptContent() {
  const dispatch = useDispatch();
  const chain = useChain();
  const realAddress = useRealAddress();
  const myMultisigsCount = useSelector(myMultisigsCountSelector) || 0;

  useEffect(() => {
    dispatch(fetchMyMultisigsCount(chain, realAddress));
  }, [dispatch, chain, realAddress]);

  return useMemo(() => {
    if (myMultisigsCount === 0) {
      return null;
    }

    const manageContent = myMultisigsCount > 1 ? "them" : "it";
    const transactionContent =
      myMultisigsCount > 1 ? "transactions" : "transaction";

    return (
      <Prompt
        cacheKey={CACHE_KEY.multisigPromptVisible}
        type={PromptTypes.NEUTRAL}
      >
        You have {myMultisigsCount} multisig {transactionContent} to sign.
        Manage &nbsp;
        {manageContent}&nbsp;
        <Link className="underline" href={"/account/multisigs"}>
          here
        </Link>
      </Prompt>
    );
  }, [myMultisigsCount]);
}

export default function MultisigManagePrompt() {
  return <PromptContent />;
}
