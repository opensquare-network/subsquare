import { cn } from "next-common/utils";
import dynamic from "next/dynamic";

const Popup = dynamic(() => import("./wrapper/Popup"), {
  ssr: false,
});

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function BaseVotesPopup(props) {
  return <Popup {...props} className={cn("!w-[640px]", props.className)} />;
}
