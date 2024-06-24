import dynamicPopup from "next-common/lib/dynamic/popup";
import { cn } from "next-common/utils";

const Popup = dynamicPopup(() => import("./wrapper/Popup"));

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function BaseVotesPopup(props) {
  return <Popup {...props} className={cn("!w-[640px]", props.className)} />;
}
