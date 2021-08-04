import styled, { css } from "styled-components";
import { useState, useRef } from "react";

import { linkedAddressData } from "utils/data";
import { useOnClickOutside } from "utils/hooks";

const Wrapper = styled.div`
  position: relative;
`;

const Select = styled.div`
  background: #ffffff;
  display: flex;
  align-items: center;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  height: 56px;
  padding: 0 16px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 16px;
  }
  > img:first-child {
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
  }
  > img:last-child {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
  }
`;

const NameWrapper = styled.div`
  flex-grow: 1;
  > :last-child {
    margin-top: 4px;
    font-size: 12px;
    color: #9da9bb;
  }
`;

const Options = styled.div`
  position: absolute;
  width: 100%;
  margin-top: 4px;
  padding: 8px 0;
  background: #ffffff;
  box-shadow: 0px 6px 22px rgba(30, 33, 52, 0.11),
    0px 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0px 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  border-radius: 4px;
`;

const Item = styled.div`
  background: #ffffff;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 16px;
  }
  > img:first-child {
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
  }
  :hover {
    background: #f6f7fa;
  }
  ${(p) =>
    p.selected &&
    css`
      background: #f6f7fa;
    `}
`;

export default function AddressSelect() {
  const [selected, setSelected] = useState(linkedAddressData[0]);
  const [show, setShow] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setShow(false));

  return (
    <Wrapper ref={ref}>
      <Select onClick={() => setShow(!show)}>
        <img src="/imgs/icons/avatar.svg" />
        <NameWrapper>
          <div>{selected.name}</div>
          <div>{selected.address}</div>
        </NameWrapper>
        <img
          src={show ? "/imgs/icons/caret-up.svg" : "/imgs/icons/caret-down.svg"}
        />
      </Select>
      {show && (
        <Options>
          {linkedAddressData.map((item, index) => (
            <Item
              key={index}
              onClick={() => {
                setSelected(item);
                setShow(false);
              }}
              selected={item.name === selected.name}
            >
              <img src="/imgs/icons/avatar.svg" />
              <NameWrapper>
                <div>{item.name}</div>
                <div>{item.address}</div>
              </NameWrapper>
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
