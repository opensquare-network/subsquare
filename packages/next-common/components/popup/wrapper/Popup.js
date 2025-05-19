import { useEffect, useState } from "react";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import * as Dialog from "@radix-ui/react-dialog";
import { noop } from "lodash-es";
import { cn } from "next-common/utils";
import { SystemClose } from "@osn/icons/subsquare";
import CommonPopupProvider from "next-common/context/popup";
import PopupContainer from "./container";
import useDetectDevice from "next-common/components/header/hooks/useDetectDevice";

let z = 999;

export const PopupSize = {
  NORMAL: "normal",
  MIDDLE: "middle",
  LARGE: "large",
};

export default function Popup({
  onClose = noop,
  title,
  className = "",
  extra,
  maskClosable = true,
  children,
  container,
  showCloseIcon = true,
  size = null,
  mobileClassName = "",
  computerClassName = "",
}) {
  const [zOverlay] = useState(z);
  const [zContent] = useState(z + 1);
  useEffect(() => {
    z++;
  }, []);

  const isMobileDevice = useDetectDevice();
  const pcClassName = `relative w-[640px] max-w-full space-y-4 ${computerClassName}`;
  const mClassName = `${mobileClassName ? mobileClassName : pcClassName}`;

  return (
    <CommonPopupProvider onClose={onClose}>
      <Dialog.Root open>
        <Dialog.Portal container={container}>
          <Dialog.Overlay />
          <Dialog.Content asChild onOpenAutoFocus={(e) => e.preventDefault()}>
            <PopupContainer
              style={{ zIndex: zOverlay }}
              onMouseDown={(event) => {
                if (maskClosable && event.target === event.currentTarget) {
                  onClose();
                }
              }}
            >
              <NeutralPanel
                className={cn(
                  "mt-[12vh] mb-4 p-6",
                  isMobileDevice ? mClassName : pcClassName,
                  className,
                  size && !isMobileDevice
                    ? size === PopupSize.NORMAL
                      ? "w-[640px]"
                      : size === PopupSize.MIDDLE
                      ? "w-[800px]"
                      : size === PopupSize.LARGE
                      ? "w-[960px]"
                      : ""
                    : "",
                )}
                style={{
                  zIndex: zContent,
                }}
              >
                {title && (
                  <div className="flex items-center justify-between">
                    <Dialog.Title asChild>
                      <h3 className="text16Bold text-textPrimary">{title}</h3>
                    </Dialog.Title>
                    <div className="flex items-center gap-[12px]">
                      {extra}
                      {showCloseIcon && (
                        <SystemClose
                          className="w-[20px] h-[20px] text-textTertiary"
                          role="button"
                          onClick={onClose}
                        />
                      )}
                    </div>
                  </div>
                )}

                {children}
              </NeutralPanel>
            </PopupContainer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </CommonPopupProvider>
  );
}
