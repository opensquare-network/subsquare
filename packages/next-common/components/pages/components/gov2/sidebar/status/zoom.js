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
import { useConfirmingStarted } from "next-common/context/post/gov2/referendum";

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
  const isConfirming = gov2State.Confirming === state;
  const confirmStart = useConfirmingStarted();

  const confirmRejected = gov2State.Rejected === state && confirmStart;
  if (isConfirming || confirmRejected) {
    return <ZoomComponents />;
  }

  return null;
}
