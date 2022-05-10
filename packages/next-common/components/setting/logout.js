import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Button from "../button";
import { logout } from "../../store/reducers/userSlice";
import {
  Label,
  ButtonWrapper,
} from "./styled";

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
