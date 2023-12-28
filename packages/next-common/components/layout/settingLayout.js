import styled from "styled-components";
import ListLayout from "next-common/components/layout/ListLayout";
import { useUser } from "next-common/context/user";
import { isKeyRegisteredUser } from "next-common/utils";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  font-size: 14px;

  input {
    background: var(--neutral100);
    border-color: var(--neutral400);
    color: var(--textPrimary);
  }
`;

export default function SettingLayout(props) {
  const user = useUser();
  const { connectedAccount } = useConnectedAccountContext();
  const chain = useChain();
  const isKeyAccount =
    (user && isKeyRegisteredUser(user)) || (!user && connectedAccount);
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  let tabs = [];

  if (isKeyAccount) {
    if (isKintsugi) {
      tabs = [
        { label: "Account", url: "/settings/key-account" },
        { label: "Notifications", url: "/settings/notifications" },
      ];
    } else {
      tabs = [
        { label: "Account", url: "/settings/key-account" },
        { label: "Proxy", url: "/settings/proxy" },
        { label: "Notifications", url: "/settings/notifications" },
      ];
    }
  } else {
    tabs = [
      { label: "Account", url: "/settings/account" },
      { label: "Link Address", url: "/settings/linked-address" },
      { label: "Notifications", url: "/settings/notifications" },
    ];
  }

  return (
    <ListLayout title={"Settings"} tabs={tabs} {...props}>
      <Wrapper>{props.children}</Wrapper>
    </ListLayout>
  );
}
