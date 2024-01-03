import styled from "styled-components";
import ListLayout from "next-common/components/layout/ListLayout";
import { useIsLoggedIn, useUser } from "next-common/context/user";
import { isKeyRegisteredUser } from "next-common/utils";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";

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
  const isLoggedIn = useIsLoggedIn();
  const chain = useChain();
  const isKeyAccount = !user || !isLoggedIn || isKeyRegisteredUser(user);
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  const accountTab = {
    label: "Account",
    url: `/settings/${isKeyAccount ? "key-account" : "account"}`,
  };
  const notificationsTab = {
    label: "Notifications",
    url: "/settings/notifications",
  };
  let tabs = [accountTab, notificationsTab];
  if (!isKeyAccount) {
    tabs.splice(1, 0, {
      label: "Link Address",
      url: "/settings/linked-address",
    });
  } else if (!isKintsugi) {
    tabs.splice(1, 0, { label: "Proxy", url: "/settings/proxy" });
  }

  return (
    <ListLayout title={"Settings"} tabs={tabs} {...props}>
      <Wrapper>{props.children}</Wrapper>
    </ListLayout>
  );
}
