import React from "react";
import Input from "next-common/lib/input";
import { Label } from "../styled";

export default function Password({ value, error, onChange }) {
  return (
    <>
      <Label>Password</Label>
      <Input
        placeholder="Please fill password"
        type="password"
        name="password"
        value={value}
        onChange={onChange}
        error={error}
      />
    </>
  );
}
