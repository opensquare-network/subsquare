import Link from "next/link";
import { useConnectPopupView } from "next-common/hooks/connect/useConnectPopupView";
import { CONNECT_POPUP_VIEWS } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { setConnectPopupView } from "../../store/reducers/connectPopupSlice";

export default function LoginRegisterContent() {
  const [view] = useConnectPopupView();
  const dispatch = useDispatch();

  let action;
  if (view === CONNECT_POPUP_VIEWS.ACCOUNT) {
    action = (
      <>
        Don&apos;t have an account?{" "}
        <Link href={"/signup"} className="text-theme500">
          Sign up
        </Link>
      </>
    );
  } else {
    action = (
      <>
        Login with{" "}
        <span
          className="text-theme500"
          role="button"
          onClick={() => {
            dispatch(setConnectPopupView(CONNECT_POPUP_VIEWS.ACCOUNT));
          }}
        >
          account
        </span>
      </>
    );
  }

  return (
    <div className="text-center text14Medium text-textSecondary">{action}</div>
  );
}
