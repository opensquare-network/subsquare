import * as Dialog from "@radix-ui/react-dialog";
import Loading from "next-common/components/loading";
import PopupContainer from "next-common/components/popup/wrapper/container";
import PopupDialogRoot from "next-common/components/popup/wrapper/root";
import dynamicClientOnly from "./clientOnly";

const defaultOptions = {
  loading: () => (
    <PopupDialogRoot>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content asChild>
          <PopupContainer className="z-[9999] items-center">
            <Loading size={40} color="var(--textTertiary)" />
          </PopupContainer>
        </Dialog.Content>
      </Dialog.Portal>
    </PopupDialogRoot>
  ),
  ssr: false,
};

/**
 * @type {dynamic}
 */
export default function dynamicPopup(dynamicOptions, options = {}) {
  return dynamicClientOnly(dynamicOptions, { ...defaultOptions, ...options });
}
