import { useEffect, useState } from "react";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import * as Dialog from "@radix-ui/react-dialog";
import noop from "lodash.noop";
import clsx from "clsx";
import { SystemClose } from "@osn/icons/subsquare";

let z = 999;
export default function Popup({
  children,
  onClose = noop,
  title,
  className = "",
  wide,
  extra,
}) {
  const [zOverlay] = useState(z);
  const [zContent] = useState(z + 1);
  useEffect(() => {
    z++;
  }, []);

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content asChild onEscapeKeyDown={onClose}>
          <div
            className="fixed inset-0 bg-black/25 flex justify-center items-start overflow-auto overscroll-y-none"
            style={{ zIndex: zOverlay }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                onClose();
              }
            }}
          >
            <NeutralPanel
              className={clsx(
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
                    <h3 className="text14Bold text-textPrimary">{title}</h3>
                  </Dialog.Title>
                  <div className="flex items-center gap-[12px]">
                    {extra}
                    <SystemClose
                      className="w-[20px] h-[20px] [&_path]:stroke-textTertiary"
                      role="button"
                      onClick={onClose}
                    />
                  </div>
                </div>
              )}

              {children}
            </NeutralPanel>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
