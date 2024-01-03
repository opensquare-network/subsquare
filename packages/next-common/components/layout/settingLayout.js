import styled from "styled-components";
import ListLayout from "next-common/components/layout/ListLayout";
import { useIsKeyUser } from "next-common/context/user";
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
  const isKeyUser = useIsKeyUser();
  const chain = useChain();
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  let tabs = [];

  if (isKeyUser) {
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
