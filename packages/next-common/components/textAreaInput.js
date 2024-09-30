import React from "react";
import tw from "tailwind-styled-components";

export const Wrapper = tw.div`
  flex
  overflow-hidden
  border
  border-neutral400
  rounded-lg
  text14Medium
  text-textDisabled
  leading-none
`;

const TextArea = tw.textarea`
  px-4
  py-2
  resize-none
  grow
  text-textPrimary
  text14Medium
  bg-transparent
  outline-none
  disabled:bg-neutral200
  placeholder:text-textDisabled
`;

export default function TextAreaInput({
  disabled = false,
  value,
  setValue = () => {},
  placeholder = "",
}) {
  return (
    <Wrapper>
      <TextArea
        disabled={disabled}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Wrapper>
  );
}
