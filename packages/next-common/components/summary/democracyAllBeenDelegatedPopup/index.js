import PopupOrigin from "next-common/components/popup/wrapper/Popup";
import styled from "styled-components";
import AllBeenDelegatedPopupTabList from "./tab";

const Popup = styled(PopupOrigin)`
  width: 480px;
`;

export default function AllBeenDelegatedPopup({
  beenDelegatedList,
  setShow = () => {},
}) {
  return (
    <Popup title="Been Delegated" onClose={() => setShow(false)}>
      <AllBeenDelegatedPopupTabList beenDelegatedList={beenDelegatedList} />
    </Popup>
  );
}
