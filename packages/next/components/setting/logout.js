import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Button from "next-common/components/button";
import { logout } from "next-common/store/reducers/userSlice";
import {
  Label,
  ButtonWrapper,
} from "components/setting/styled";

export default function Logout() {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div>
      <Label>Logout</Label>
      <ButtonWrapper>
        <Button
          isFill
          onClick={() => {
            dispatch(logout());
            router.replace("/");
          }}
        >
          Logout my account
        </Button>
      </ButtonWrapper>
    </div>
  );
}
