import { useContextApi } from "next-common/context/api";
import Tooltip from "next-common/components/tooltip";

export function useCheckApiConnected() {
  const api = useContextApi();

  const isConnected = !!api;

  return {
    isConnected,
    component: CheckApiConnectedWrapper,
  };
}

export function CheckApiConnectedWrapper({ children, isConnected = true }) {
  if (!isConnected) {
    return <Tooltip content="RPC is not connected">{children}</Tooltip>;
  }

  return children;
}
