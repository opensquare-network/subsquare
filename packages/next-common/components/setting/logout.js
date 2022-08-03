import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { logout } from "../../store/reducers/userSlice";
import { ButtonWrapper, Label } from "./styled";
import GhostButton from "../buttons/ghostButton";

export default function Logout() {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div>
      <Label>Logout</Label>
      <ButtonWrapper>
        <GhostButton
          isFill
          onClick={() => {
            dispatch(logout());
            router.replace("/");
          }}
        >
          Logout my account
        </GhostButton>
      </ButtonWrapper>
    </div>
  );
}
