import PopupOrigin from "next-common/components/popup/wrapper/Popup";
import styled from "styled-components";
import MyDelegationTabList from "./tab";

const Popup = styled(PopupOrigin)`
  width: 480px;
`;

export default function MyDelegationPopup({ delegations, setShow = () => {} }) {
  return (
    <Popup title="My Delegation" onClose={() => setShow(false)}>
      <MyDelegationTabList delegations={delegations} />
    </Popup>
  );
}
