import Popup from "./wrapper/Popup";
import { cn } from "next-common/utils";

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function BaseVotesPopup(props) {
  return <Popup {...props} className={cn("!w-[640px]", props.className)} />;
}
