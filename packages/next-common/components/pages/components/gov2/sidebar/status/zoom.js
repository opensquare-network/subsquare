import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import {
  toggleZoom,
  useZoomDispatch,
  useZoomMode,
  zoomModes,
} from "./context/zoomContext";
import { Tooltip } from "./styled";
import { SystemZoomIn, SystemZoomOut } from "@osn/icons/subsquare";

function ZoomComponents() {
  const mode = useZoomMode();
  const dispatch = useZoomDispatch();
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
  if (gov2State.Confirming === state) {
    return <ZoomComponents />;
  }

  return null;
}
