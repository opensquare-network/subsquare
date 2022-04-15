import styled from "styled-components";
import { useState, useEffect, useContext } from "react";

import { useApi } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { getNode, toPrecision } from "utils";
import Loading from "./loading";
import { StatusContext } from "./statusContext";

const BalanceWrapper = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
  > :nth-child(2) {
    color: #1e2134;
    font-weight: bold;
    margin-left: 8px;
  }
`;

const balanceMap = new Map();

export default function AccountBalance({ chain }) {
  const { signerAccount, signerBalance, setSignerBalance } =
    useContext(StatusContext);

  const isMounted = useIsMounted();
  const [loadingBalance, setLoadingBalance] = useState(false);
  const node = getNode(chain);

  const api = useApi(chain);

  useEffect(() => {
    if (balanceMap.has(signerAccount?.address)) {
      setSignerBalance(balanceMap.get(signerAccount?.address));
      return;
    }
    if (api && signerAccount) {
      setLoadingBalance(true);
      api.query.system
        .account(signerAccount.address)
        .then((result) => {
          if (isMounted.current) {
            setSignerBalance(result.data.free);
            balanceMap.set(signerAccount.address, result.data.free);
          }
        })
        .finally(() => {
          if (isMounted.current) {
            setLoadingBalance(false);
          }
        });
    }
  }, [api, signerAccount, node.decimals, isMounted, setSignerBalance]);

  return (
    <BalanceWrapper>
      <div>Balance</div>
      <div>
        {loadingBalance ? (
          <Loading />
        ) : (
          toPrecision(signerBalance, node.decimals)
        )}
      </div>
    </BalanceWrapper>
  );
}
