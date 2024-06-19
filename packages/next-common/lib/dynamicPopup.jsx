import * as Dialog from "@radix-ui/react-dialog";
import { isPlainObject, merge } from "lodash-es";
import Loading from "next-common/components/loading";
import PopupContainer from "next-common/components/popup/wrapper/container";
import dynamic from "next/dynamic";

const defaultOptions = {
  loading: () => (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content asChild>
          <PopupContainer className="z-50 items-center">
            <Loading size={40} color="var(--textTertiary)" />
          </PopupContainer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
  ssr: false,
};

/**
 * @type {dynamic}
 */
export default function dynamicPopup(dynamicOptions, options) {
  if (isPlainObject(dynamicOptions)) {
    dynamicOptions = merge(defaultOptions, dynamicOptions);
  }

  return dynamic(dynamicOptions, { ...defaultOptions, ...options });
}
