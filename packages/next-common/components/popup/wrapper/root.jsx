import * as Dialog from "@radix-ui/react-dialog";

// Non-modal on purpose: Radix's modal DismissableLayer writes to
// document.body.style, which throws if the body is gone during teardown.
// PopupContainer already covers the viewport and handles mask clicks.
export default function PopupDialogRoot({ children }) {
  return (
    <Dialog.Root open modal={false}>
      {children}
    </Dialog.Root>
  );
}
