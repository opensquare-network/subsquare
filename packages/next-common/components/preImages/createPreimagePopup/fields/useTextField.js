import TextInputField from "next-common/components/popup/fields/textInputField";
import { useState } from "react";

export default function useTextField({ title }) {
  const [text, setText] = useState("");

  return {
    value: text,
    component: <TextInputField title={title} text={text} setText={setText} />,
  };
}
