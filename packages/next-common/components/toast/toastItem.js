import { useDispatch } from "react-redux";
import { removeToast } from "../../store/reducers/toastSlice";
import Loading from "../loading";
import { cn } from "next-common/utils";
import {
  SystemClose,
  SystemFailure,
  SystemSuccess,
  SystemWarning,
} from "@osn/icons/subsquare";

export default function ToastItem({ type, message, id }) {
  const dispatch = useDispatch();

  const icons = {
    pending: <Loading size={20} />,
    success: <SystemSuccess className="w-5 h-5" />,
    warning: <SystemWarning className="w-5 h-5" />,
    error: <SystemFailure className="w-5 h-5" />,
  };

  return (
    <div
      className={cn(
        "w-full h-full",
        "shadow-200",
        "border border-neutral300 rounded-lg",
      )}
    >
      <div
        className={cn(
          "w-full h-full",
          "flex items-center gap-x-2",
          "p-4",
          "bg-neutral100",
          "text14Medium text-textPrimary",
          "rounded-[inherit] border-l-[7px] border-transparent",
          type === "success" && "border-green500",
          type === "warning" && "border-orange500",
          type === "error" && "border-red500",
          type === "pending" && "border-blue500",
        )}
      >
        {icons[type]}
        <div className="w-full">{message}</div>
        <SystemClose
          role="button"
          className="[&_path]:fill-textTertiary"
          onClick={() => {
            dispatch(removeToast(id));
          }}
        />
      </div>
    </div>
  );
}
