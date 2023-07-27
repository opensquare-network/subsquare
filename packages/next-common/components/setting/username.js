import React from "react";
import Input from "../input";
import { InputWrapper } from "./styled";

export default function Username({ username }) {
  return (
    <InputWrapper>
      <Input defaultValue={username} disabled />
    </InputWrapper>
  );
}
