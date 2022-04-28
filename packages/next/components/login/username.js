import Input from "next-common/components/input";
import {
  Label,
} from "components/login/styled";

export default function Username({ value, error, onChange }) {
  return (
    <>
      <Label>Username</Label>
      <Input
        placeholder="Please fill your name or email"
        name="usernameOrEmail"
        value={value}
        onChange={onChange}
        error={error}
      />
    </>
  )
}
