import styled from "styled-components";
import ListLayout from "next-common/components/layout/ListLayout";
import { useUser } from "next-common/context/user";
import { isKeyRegisteredUser } from "next-common/utils";

const Wrapper = styled.div`
  font-size: 14px;

  input {
    background: var(--neutral100);
    border-color: var(--neutral400);
    color: var(--textPrimary);
  }
`;

export default function SettingLayout(props) {
  const user = useUser();
  const isKeyAccount = user && isKeyRegisteredUser(user);

  const tabs = isKeyAccount
    ? [
        { label: "Account", url: "/setting/key-account" },
        { label: "Proxy", url: "/setting/proxy" },
        { label: "Notification", url: "/setting/notification" },
      ]
    : [
        { label: "Account", url: "/setting/account" },
        { label: "Link Address", url: "/setting/linked-address" },
        { label: "Notification", url: "/setting/notification" },
      ];

  return (
    <ListLayout title={"Setting"} tabs={tabs} {...props}>
      <Wrapper>{props.children}</Wrapper>
    </ListLayout>
  );
}
