import { createContext, useContext, useReducer } from "react";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";

const ZoomContext = createContext(null);
const ZoomDispatchContext = createContext(null);

export const zoomModes = Object.freeze({
  in: "zoom-in",
  out: "zoom-out",
});

export function ZoomProvider({ children }) {
  const state = usePostState();
  let initialMode;
  if (gov2State.Confirming === state) {
    initialMode = zoomModes.in;
  } else {
    initialMode = zoomModes.out;
  }

  const [mode, dispatch] = useReducer(zoomReducer, initialMode);

  return (
    <ZoomContext.Provider value={mode}>
      <ZoomDispatchContext.Provider value={dispatch}>
        {children}
      </ZoomDispatchContext.Provider>
    </ZoomContext.Provider>
  );
}

function zoomReducer(mode, action) {
  if (action.type === "toggle") {
    return mode === zoomModes.in ? zoomModes.out : zoomModes.in;
  }

  throw Error("Unknown zoomReducer action: " + action.type);
}

export function useZoomMode() {
  return useContext(ZoomContext);
}

export function useZoomDispatch() {
  return useContext(ZoomDispatchContext);
}

export function toggleZoom(dispatch) {
  dispatch({
    type: "toggle",
  });
}
