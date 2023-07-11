import Popup from "./wrapper/Popup";
import clsx from "clsx";

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function BaseVotesPopup(props) {
  return <Popup {...props} className={clsx("!w-[640px]", props.className)} />;
}
