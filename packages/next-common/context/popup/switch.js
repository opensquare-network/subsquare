import { createStateContext } from "react-use";

const [useSharedPopupOpenState, PopupOpenStateProvider] =
  createStateContext(false);

export default PopupOpenStateProvider;

export { useSharedPopupOpenState };
