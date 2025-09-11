import styled from "styled-components";
import ListLayout from "next-common/components/layout/ListLayout";
import { useIsWeb3User } from "next-common/context/user";
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
  const isWeb3User = useIsWeb3User();
  const chain = useChain();
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  const accountTab = {
    label: "Account",
    value: "account",
    url: `/settings/${isWeb3User ? "key-account" : "account"}`,
  };
  const notificationsTab = {
    label: "Notifications",
    value: "notifications",
    url: "/settings/notifications",
  };
  let tabs = [accountTab, notificationsTab];
  if (!isWeb3User) {
    tabs.splice(1, 0, {
      label: "Link Address",
      value: "link_address",
      url: "/settings/linked-address",
    });
  } else if (!isKintsugi) {
    tabs.splice(1, 0, {
      label: "Proxy",
      value: "proxy",
      url: "/settings/proxy",
    });
  }

  return (
    <ListLayout title={"Settings"} tabs={tabs} {...props}>
      <Wrapper>{props.children}</Wrapper>
    </ListLayout>
  );
}
