import styled from "styled-components";
import { useUser } from "../context/user";
import { isSameAddress } from "../utils";
import Account from "./account";
import EmptyAccount from "./emptyAccount";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;

  background: #f6f7fa;
  border-radius: 4px;
`;

export default function ConnectedSigner({ extensionAccounts }) {
  const loginUser = useUser();
  const account = extensionAccounts.find((item) =>
    isSameAddress(item.address, loginUser?.address)
  );

  const accountData = {
    address: account.address,
    name: account.meta.name,
  };

  return (
    <Wrapper>
      {account ? <Account account={accountData} /> : <EmptyAccount />}
    </Wrapper>
  );
}
