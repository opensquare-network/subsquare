import styled from "styled-components";
import ListLayout from "next-common/components/layout/ListLayout";
import { useUser } from "next-common/context/user";
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
  const chain = useChain();
  const isKeyAccount = user && isKeyRegisteredUser(user);
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  let tabs = [];

  if (isKeyAccount) {
    if (isKintsugi) {
      tabs = [
        { label: "Account", url: "/settings/key-account" },
        { label: "Notification", url: "/settings/notification" },
      ];
    } else {
      tabs = [
        { label: "Account", url: "/settings/key-account" },
        { label: "Proxy", url: "/settings/proxy" },
        { label: "Notification", url: "/settings/notification" },
      ];
    }
  } else {
    tabs = [
      { label: "Account", url: "/settings/account" },
      { label: "Link Address", url: "/settings/linked-address" },
      { label: "Notification", url: "/settings/notification" },
    ];
  }

  return (
    <ListLayout title={"Setting"} tabs={tabs} {...props}>
      <Wrapper>{props.children}</Wrapper>
    </ListLayout>
  );
}
