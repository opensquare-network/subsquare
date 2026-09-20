import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useConnect } from "wagmi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

export default function useEVMWalletConnect(connector) {
  const { mutateAsync } = useConnect();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [uri, setUri] = useState(null);
  const isActive = useRef(false);
  const isOpenRef = useRef(false);
  const pendingConnection = useRef(null);

  useEffect(() => {
    isActive.current = true;
    function onMessage(message) {
      if (message.type === "display_uri") {
        setUri(message.data);
      }
    }
    connector?.emitter.on("message", onMessage);
    return () => {
      isActive.current = false;
      connector?.emitter.off("message", onMessage);
    };
  }, [connector]);

  async function open(onConnected) {
    if (!connector) {
      return false;
    }
    isOpenRef.current = true;
    setIsOpen(true);
    if (pendingConnection.current) {
      return false;
    }
    setUri(null);
    try {
      pendingConnection.current = mutateAsync({ connector });
      const connection = await pendingConnection.current;
      if (isActive.current && isOpenRef.current) {
        await onConnected?.(connection);
      }
      if (isActive.current) {
        setIsOpen(false);
      }
      return isActive.current && isOpenRef.current;
    } catch (error) {
      if (isActive.current) {
        setIsOpen(false);
        dispatch(newErrorToast(error.message));
      }
      return false;
    } finally {
      pendingConnection.current = null;
      if (isActive.current) {
        setUri(null);
      }
    }
  }

  function close() {
    isOpenRef.current = false;
    setIsOpen(false);
  }

  return { uri, isOpen, open, close };
}
