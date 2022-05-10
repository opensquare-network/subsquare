import React from "react";
import Input from "../input";
import {
  Label,
  InputWrapper,
} from "./styled";

export default function Username({ username }) {
  return (
    <div>
      <Label>Username</Label>
      <InputWrapper>
        <Input defaultValue={username} disabled />
      </InputWrapper>
    </div>
  );
}
