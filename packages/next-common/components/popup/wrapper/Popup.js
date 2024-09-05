import { useEffect, useState } from "react";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import * as Dialog from "@radix-ui/react-dialog";
import { noop } from "lodash-es";
import { cn } from "next-common/utils";
import { SystemClose } from "@osn/icons/subsquare";
import CommonPopupProvider from "next-common/context/popup";
import PopupContainer from "./container";

let z = 999;

export default function Popup({
  onClose = noop,
  title,
  className = "",
  wide,
  extra,
  maskClosable = true,
  children,
  container,
}) {
  const [zOverlay] = useState(z);
  const [zContent] = useState(z + 1);
  useEffect(() => {
    z++;
  }, []);

  return (
    <CommonPopupProvider onClose={onClose}>
      <Dialog.Root
        open
        onOpenChange={() => {
          if (maskClosable) {
            onClose();
          }
        }}
      >
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
                  "relative mt-[12vh] mb-4",
                  "w-[400px] max-w-full",
                  wide && "sm:w-[480px]",
                  "p-6 space-y-4",
                  className,
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
                      <SystemClose
                        className="w-[20px] h-[20px] text-textTertiary"
                        role="button"
                        onClick={onClose}
                      />
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
