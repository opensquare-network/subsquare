import { useRouter } from "next/router";
import NetworkSwitch from "next-common/components/header/networkSwitch";
import NodeSwitch from "next-common/components/header/nodeSwitch";
import PrimaryButton from "../buttons/primaryButton";
import { useUser } from "../../context/user";
import { useChainSettings } from "../../context/chain";
import Profile from "../../assets/imgs/icons/profile.svg";
import SearchInput from "./searchInput";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import SystemUser from "../user/systemUser";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useAccountMenu } from "./useAccountMenu";
import {
  ButtonWrapper,
  Item,
  Title,
  UserWrapper,
  Wrapper,
} from "./drawerStyled";

function ProfileMenuItem({ onClick }) {
  return (
    <Item onClick={onClick}>
      <Profile />
      <span>Profile</span>
    </Item>
  );
}

export default function SidebarAccount() {
  const user = useUser();
  const router = useRouter();
  const node = useChainSettings();
  const { openLoginPopup } = useLoginPopup();
  const { disconnect: disconnectAccount } = useConnectedAccountContext();
  const accountMenu = useAccountMenu();

  const handleAccountMenu = async (item) => {
    if (item.value === "logout") {
      await disconnectAccount();
    } else if (item.pathname) {
      await router.push(item.pathname);
    }
  };

  const openUserProfile = () => {
    router.push(`/user/${user.address}`);
  };

  return (
    <Wrapper>
      <SearchInput shortcut={false} inputType="search" />

      <Title>NETWORK</Title>
      <NetworkSwitch activeNode={node} />
      {node?.hideHeight ? null : <Title>NODE</Title>}
      <NodeSwitch />
      <Title>ACCOUNT</Title>
      {!user && (
        <ButtonWrapper>
          <PrimaryButton onClick={() => openLoginPopup()}>
            Connect
          </PrimaryButton>
        </ButtonWrapper>
      )}
      {user && (
        <div>
          <UserWrapper>
            <SystemUser user={user} noEvent />
          </UserWrapper>
          {user.address && <ProfileMenuItem onClick={openUserProfile} />}
          {accountMenu.map((item, index) => (
            <Item key={index} onClick={() => handleAccountMenu(item)}>
              {item.icon}
              <span>{item.name}</span>
            </Item>
          ))}
        </div>
      )}
    </Wrapper>
  );
}
