import Input from "next-common/components/input";
import {
  Label,
  InputWrapper,
} from "components/setting/styled";

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
