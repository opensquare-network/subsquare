import Input from "next-common/components/input";
import {
  Label,
} from "components/login/styled";

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
  )
}
