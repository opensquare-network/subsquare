import React from "react";
import styled from "styled-components";

import Input from "../input";
import FlexBetween from "../styled/flexBetween";

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
`;

const SubButton = styled.button`
  all: unset;
  font-size: 12px;
  font-weight: 500;
  color: #6848ff;
  cursor: pointer;
`;

export default function EmailInput({
  identity,
  email,
  setEmail,
  errors,
  setErrors,
}) {
  return (
    <>
      <FlexBetween>
        <Label>Email</Label>
        {identity?.info?.email && (
          <SubButton onClick={() => setEmail(identity?.info?.email)}>
            Use identity email
          </SubButton>
        )}
      </FlexBetween>
      <Input
        placeholder="Please fill email"
        name="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors(null);
        }}
        error={errors?.data?.email}
      />
    </>
  );
}
