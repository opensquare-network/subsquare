import dynamicPopup from "next-common/lib/dynamic/popup";

const Popup = dynamicPopup(() => import("./wrapper/Popup"));

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function BaseVotesPopup(props) {
  return <Popup {...props} className={props.className} />;
}
