import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import {
  useZoomDispatch,
  useZoomMode,
  zoomModes,
  toggleZoom,
} from "./context/zoomContext";
import { Tooltip } from "./styled";
import { SystemZoomIn, SystemZoomOut } from "@osn/icons/subsquare";

function ZoomComponents() {
  const mode = useZoomMode();
  const dispatch = useZoomDispatch();
  console.log("dispatch", dispatch);
  const isZoomIn = mode === zoomModes.in;

  return (
    <Tooltip content={isZoomIn ? "Zoom Out" : "Zoom In"}>
      {isZoomIn ? (
        <SystemZoomOut
          role="button"
          className="w-5 h-5 [&_path]:fill-textTertiary"
          onClick={() => toggleZoom(dispatch)}
        />
      ) : (
        <SystemZoomIn
          role="button"
          className="w-5 h-5 [&_path]:fill-textTertiary"
          onClick={() => toggleZoom(dispatch)}
        />
      )}
    </Tooltip>
  );
}

export default function Zoom() {
  const state = usePostState();
  const isConfirming = gov2State.Confirming === state;
  if (!isConfirming) {
    return null;
  }

  return <ZoomComponents />;
}
