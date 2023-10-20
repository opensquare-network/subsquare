import {
  removeToast,
  toastsSelector,
} from "next-common/store/reducers/toastSlice";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import ToastItem from "./toastItem";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Toast() {
  const toasts = useSelector(toastsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    (toasts || []).map(({ type, message, id, sticky, timeout }) => {
      toast.custom(
        () => (
          <ToastItem
            type={type}
            message={message}
            id={id}
            key={id}
            sticky={sticky}
            timeout={timeout}
          />
        ),
        {
          id,
          duration: sticky ? 9999999999 : timeout || 5000,
          onAutoClose() {
            dispatch(removeToast(id));
          },
        },
      );
    });
  }, [dispatch, toasts]);

  return (
    <Toaster
      toastOptions={{
        className: "w-full !h-[68px]",
      }}
      className="!w-[400px] !top-24 !right-6 max-sm:!w-full pointer-events-auto"
      position="top-right"
      expand
      visibleToasts={6}
    />
  );
}
