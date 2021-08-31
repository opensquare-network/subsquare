import styled, { css } from "styled-components";
import { useState, useRef } from "react";

import { useOnClickOutside } from "utils/hooks";
import { addressEllipsis } from "utils";
import Avatar from "components/avatar";

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
    margin-left: auto;
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
  box-shadow:0 6px 22px rgba(30, 33, 52, 0.11),
   0 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
   0 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
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

export default function AddressSelect({
  chain,
  accounts,
  selectedAccount,
  onSelect,
}) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setShow(false));

  return (
    <Wrapper ref={ref}>
      <Select onClick={() => setShow(!show)}>
        {selectedAccount && (
          <>
            <Avatar address={selectedAccount?.karuraAddress} />
            <NameWrapper>
              <div>{selectedAccount?.name}</div>
              <div>{addressEllipsis(selectedAccount?.karuraAddress)}</div>
            </NameWrapper>
          </>
        )}
        <img
          src={show ? "/imgs/icons/caret-up.svg" : "/imgs/icons/caret-down.svg"}
        />
      </Select>
      {show && (
        <Options>
          {(accounts || []).map((item, index) => (
            <Item
              key={index}
              onClick={() => {
                onSelect(item);
                setShow(false);
              }}
              selected={item.address === selectedAccount?.address}
            >
              <Avatar address={item.karuraAddress} />
              <NameWrapper>
                <div>{item.name}</div>
                <div>{addressEllipsis(item.karuraAddress)}</div>
              </NameWrapper>
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
