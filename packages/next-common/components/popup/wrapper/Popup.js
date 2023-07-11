import { useEffect, useState } from "react";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import * as Dialog from "@radix-ui/react-dialog";
import noop from "lodash.noop";
import clsx from "clsx";
import { SystemClose } from "@osn/icons/subsquare";

let z_overlay_init = 999;
let z_content_init = 1000;
export default function Popup({
  children,
  onClose = noop,
  title,
  className = "",
  wide,
}) {
  const [zOverlay] = useState(z_overlay_init);
  const [zContent] = useState(z_content_init);
  useEffect(() => {
    z_overlay_init++;
    z_content_init++;
  }, []);

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={clsx("fixed inset-0 bg-black/25")}
          style={{ zIndex: zOverlay }}
        />
        <Dialog.Content asChild onEscapeKeyDown={onClose}>
          <NeutralPanel
            className={clsx(
              "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
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
                  <h3 className="text14Bold">{title}</h3>
                </Dialog.Title>
                <SystemClose
                  className="w-4 h-4 [&_path]:stroke-textTertiary"
                  role="button"
                  onClick={onClose}
                />
              </div>
            )}

            {children}
          </NeutralPanel>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
