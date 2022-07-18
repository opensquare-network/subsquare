import styled, { css } from "styled-components";
import * as ReactDatePicker from "react-datepicker";
import { useState, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { useOnClickOutside } from "frontedUtils/hooks";
import { ReactComponent as CaretRight } from "/public/imgs/icons/caret-right.svg";
import { ReactComponent as ArrowLeft } from "/public/imgs/icons/arrow-left.svg";
import { ReactComponent as ArrowRight } from "/public/imgs/icons/arrow-right.svg";
import Button from "@osn/common-ui/es/styled/Button";
import {
  p_14_medium,
  p_14_normal,
  p_16_normal,
  p_16_semibold,
} from "../styles/componentCss";
import { Flex, FlexBetween } from "@osn/common-ui";

const Wrapper = styled.div`
  position: relative;
`;

const DateTimeWrapper = styled.div``;

const DateButton = styled.div`
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  :hover {
    border-color: #b7c0cc;
  }
  display: flex;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  .placeholder {
    color: #9da9bb;
  }
  > div {
    flex-grow: 1;
  }
  > svg {
    flex: 0 0 24px;
    fill: #506176;
  }
  ${(p) =>
    p.active &&
    css`
      border-color: #b7c0cc;
    `}
`;

const DateWrapper = styled.div`
  position: absolute;
  z-index: 1;
  right: 0;
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.06),
    0px 0.751293px 8px rgba(26, 33, 44, 0.04);

  .react-datepicker__header {
    background: transparent;
    border: none;
    padding: 0;
  }

  .react-datepicker__day-name {
    width: 40px;
    font-family: Inter, sans-serif;
    ${p_14_medium};
    text-align: center;
    color: #506176;
    margin: 0 !important;
  }

  .react-datepicker__day-names {
    margin-bottom: 8px;
  }

  .react-datepicker {
    border-radius: 0;
    border: none;
  }

  .react-datepicker__month {
    margin: 0;
  }

  .react-datepicker__day {
    width: 40px;
    height: 40px;
    font-family: Inter, sans-serif;
    ${p_14_normal};
    color: #1e2134;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    margin: 0 !important;
    :hover {
      background: #f0f3f8;
    }
  }

  .react-datepicker__day--today {
    font-weight: 600;
    border: 1px solid #e2e8f0;
  }

  .react-datepicker__day--selected {
    background: #f0f3f8;
  }

  .react-datepicker__day--outside-month {
    color: #9da9bb;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: transparent;
  }

  .react-datepicker__day--disabled {
    color: #9da9bb;
    cursor: not-allowed;
    &:hover {
      background: none;
    }
  }
`;

const DateHeader = styled(Flex)`
  > div {
    font-family: Inter, sans-serif;
    ${p_16_semibold};
    text-align: center;
    color: #1e2134;
    flex: 1 1 auto;
  }
  > svg {
    cursor: pointer;
    path {
      fill: #506176;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #f0f3f8;
  margin: 16px 0;
`;

const ButtonWrapper = styled(Flex)`
  margin-top: 20px;
  justify-content: flex-end;
  > :not(:first-child) {
    margin-left: 16px;
  }
`;

const TimeWrapper = styled.div`
  z-index: 2;
  position: absolute;
  right: 0;
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.06),
    0px 0.751293px 8px rgba(26, 33, 44, 0.04);
`;

const TimeHeaderWrapper = styled(FlexBetween)`
  ${p_16_normal};
  white-space: nowrap;
  > :first-child {
    font-weight: 600;
    color: #1e2134;
  }
  > :last-child {
    color: #9da9bb;
    font-size: 14px;
  }
`;

const TimeInputWrapper = styled(FlexBetween)`
  margin: 20px 0;
  padding: 12px 4px;
  width: 280px;
  height: 48px;
  border-bottom: 1px solid #e2e8f0;
  ${p_14_normal};
  background: #fbfcfe;
`;

const TimeInput = styled.input`
  all: unset;
  width: 128px;
  height: 24px;
  text-align: center;
`;

export default function DatePicker({
  date,
  setDate,
  placeholder,
  minDate,
  maxDate,
  button,
  onSelect = () => {},
  defaultTime = "00:00",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState("date");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const ref = useRef();
  const today = moment()
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .toDate();
  useOnClickOutside(ref, () => setIsOpen(false));
  const handleChange = (e) => {
    setDate(e);
  };
  const handleClick = (e) => {
    e.preventDefault();
    setShow("date");
    setIsOpen(!isOpen);
  };
  const onToday = () => {
    if (date) {
      setDate(
        moment(date)
          .set({
            year: today.year(),
            month: today.month(),
            date: today.date(),
          })
          .toDate()
      );
    } else {
      setDate(today);
    }
  };
  const checkInt = (value) => {
    if (value && value.indexOf(".") > 0) return false;
    return !(isNaN(value) && !Number.isInteger(Number(value)));
  };
  const isToday = (date) => {
    return date.getTime() === today.getTime();
  };
  const onHourChange = (e) => {
    let value = e.target.value;
    if (value.length > 2 && value[0] === "0") {
      value = value.slice(1, 3);
    }
    if (!checkInt(value)) return;
    if (Number(value) > 23 || Number(value) < 0) return;
    setHour(value);
  };
  const onMinuteChange = (e) => {
    let value = e.target.value;
    if (value.length > 2 && value[0] === "0") {
      value = value.slice(1, 3);
    }
    if (!checkInt(value)) return;
    if (Number(value) > 59 || Number(value) < 0) return;
    setMinute(value);
  };
  const format = (value) => {
    if (value === null || value === undefined) return "";
    if (value < 10) return "0" + value;
    return "" + value;
  };
  const formatTime = () => {
    let hour = defaultTime?.split(":")?.[0] || "00";
    let minute = defaultTime?.split(":")?.[1] || "00";
    if (date) {
      hour = moment(date).hour();
      minute = moment(date).minute();
      if (isToday(date) && defaultTime === "now") {
        const now = new Date();
        hour = now.getHours();
        minute = now.getMinutes();
      }
    }
    setHour(format(hour));
    setMinute(format(minute));
    setDate(moment(date).set({ hour, minute }).toDate());
  };
  const onSelectTime = () => {
    setDate(
      moment(date)
        .set({ hour: Number(hour), minute: Number(minute) })
        .toDate()
    );
    onSelect();
  };

  return (
    <Wrapper ref={ref}>
      <DateTimeWrapper>
        {button ? (
          <div onClick={handleClick}>{button}</div>
        ) : (
          <DateButton onClick={handleClick} active={isOpen}>
            {date && <div>{moment(date).format("MMM,DD YYYY HH:mm")}</div>}
            {!date && <div className="placeholder">{placeholder}</div>}
            <CaretRight />
          </DateButton>
        )}
        {isOpen && (
          <>
            {show === "date" && (
              <DateWrapper>
                <ReactDatePicker
                  selected={date}
                  minDate={minDate}
                  maxDate={maxDate}
                  onChange={handleChange}
                  inline
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                  }) => (
                    <div>
                      <DateHeader>
                        <ArrowLeft onClick={decreaseMonth} />
                        <div>{moment(date).format("MMM, YYYY")}</div>
                        <ArrowRight onClick={increaseMonth} />
                      </DateHeader>
                      <Divider />
                    </div>
                  )}
                  formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
                />
                <ButtonWrapper>
                  <Button
                    primary
                    disabled={!date}
                    onClick={() => {
                      if (!date) onToday();
                      formatTime();
                      setShow("time");
                    }}
                  >
                    Next
                  </Button>
                </ButtonWrapper>
              </DateWrapper>
            )}
            {show === "time" && (
              <TimeWrapper>
                <TimeHeaderWrapper>
                  <div>Select Time</div>
                  <div>{moment(date).format("MMM,DD YYYY")}</div>
                </TimeHeaderWrapper>
                <Divider />
                <TimeInputWrapper>
                  <TimeInput
                    value={hour}
                    onChange={onHourChange}
                    placeholder="00"
                  />
                  <div>:</div>
                  <TimeInput
                    value={minute}
                    onChange={onMinuteChange}
                    placeholder="00"
                  />
                </TimeInputWrapper>
                <ButtonWrapper>
                  <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button
                    primary
                    onClick={() => {
                      onSelectTime();
                      setIsOpen(false);
                    }}
                  >
                    Select
                  </Button>
                </ButtonWrapper>
              </TimeWrapper>
            )}
          </>
        )}
      </DateTimeWrapper>
    </Wrapper>
  );
}
