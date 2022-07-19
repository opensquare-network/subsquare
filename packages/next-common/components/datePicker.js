import styled, { css } from "styled-components";
import ReactDatePicker from "react-datepicker";
import { useState, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import ArrowLeft from "../assets/imgs/icons/caret-left-16.svg";
import ArrowRight from "../assets/imgs/icons/caret-right-16.svg";
import Close from "../assets/imgs/icons/close-16.svg";
import Button from "./button";
import {
  p_14_medium,
  p_14_normal,
  p_16_semibold,
} from "../styles/componentCss";
import Flex from "./styled/flex";
import FlexBetween from "./styled/flexBetween";
import Input from "./input";

const CaretWrapper = styled.div`
  cursor: pointer;
  padding: 6px 7px 5px 7px;
  border: 1px solid #e0e4eb;
  border-radius: 4px;

  :hover {
    border-color: #1e2134;
  }
`;

const CaretLeft = ({ onClick }) => {
  return (
    <CaretWrapper onClick={onClick}>
      <ArrowLeft />
    </CaretWrapper>
  );
};

const CaretRight = ({ onClick }) => {
  return (
    <CaretWrapper onClick={onClick}>
      <ArrowRight />
    </CaretWrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const DateTimeWrapper = styled.div``;

const Label = styled.span`
  width: 91px;
  line-height: 40px;
  background: #f6f7fa;
  border-right: 1px solid #e0e4eb;
  text-align: center;
`;

const DateTime = styled.span`
  padding-left: 16px;
  flex-grow: 1;
  text-align: left;
`;

const DateButton = styled.div`
  border: 1px solid #e2e8f0;

  :hover {
    border-color: #b7c0cc;
  }

  display: flex;
  align-items: center;
  justify-content: space-between;
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
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 22px rgba(30, 33, 52, 0.11),
    0px 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0px 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  border-radius: 8px;

  h2 {
    margin-top: 0;
    font-size: 14px;
    line-height: 20px;
  }

  h6 {
    margin-top: 16px;
    margin-bottom: 8px;
  }

  h2 + button {
    all: unset;
    cursor: pointer;
  }

  h2 + span {
    font-size: 12px;
    font-weight: 500;
    color: #9da9bb;
  }

  .react-datepicker {
    margin-bottom: 16px;
    padding: 8px;
    border: 1px solid #e0e4eb;
    border-radius: 4px;
  }

  .react-datepicker__header {
    background: transparent;
    border: none;
    padding: 0;
  }

  .react-datepicker__day-name {
    width: 47.85px;
    font-family: Inter, sans-serif;
    ${p_14_medium};
    text-align: center;
    color: #506176;
    margin: 0 !important;
  }

  .react-datepicker__day-names {
    line-height: 32px;
  }

  .react-datepicker__month {
    margin: 0;
  }

  .react-datepicker__day {
    width: 47.85px;
    height: 32px;
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
  margin-bottom: 8px;

  > b {
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

const ButtonWrapper = styled(Flex)`
  margin-top: 20px;
  justify-content: flex-end;

  > :not(:first-child) {
    margin-left: 16px;
  }
`;

const TimeWrapper = styled(FlexBetween)`
  gap: 8px;
  align-items: center;

  input {
    width: 132px;
    line-height: 20px;
    text-align: center;
  }

  span {
    line-height: 40px;
  }
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

  const isToday = (date) => {
    return date.getTime() === today.getTime();
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
    setDate(moment(date).set({ hour, minute }).toDate());
  };

  return (
    <Wrapper ref={ref}>
      <DateTimeWrapper>
        {button ? (
          <div onClick={handleClick}>{button}</div>
        ) : (
          <DateButton onClick={handleClick} active={isOpen}>
            <Label>End time</Label>
            <DateTime>{moment(date).format("YYYY-MM-DD, HH:mm")}</DateTime>

            {/*{!date && <div className="placeholder">{placeholder}</div>}*/}

            <ArrowRight />
          </DateButton>
        )}
        {isOpen && (
          <>
            {show === "date" && (
              <DateWrapper>
                <FlexBetween>
                  <h2>Select End Time</h2>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <Close />
                  </button>
                </FlexBetween>
                <h6>Date</h6>
                <ReactDatePicker
                  selected={date}
                  minDate={new Date()}
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
                        <CaretLeft onClick={decreaseMonth} />
                        <b>{moment(date).format("YYYY-MM")}</b>
                        <CaretRight onClick={increaseMonth} />
                      </DateHeader>
                    </div>
                  )}
                  formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
                />
                <FlexBetween>
                  <h2>Time</h2>
                  <span>24-hour clock</span>
                </FlexBetween>

                <TimeWrapper>
                  <Input placeholder="00" />
                  <span>:</span>
                  <Input placeholder="00" />
                </TimeWrapper>
                <ButtonWrapper>
                  <Button
                    primary
                    onClick={() => {
                      if (!date) onToday();
                      formatTime();
                    }}
                  >
                    Confirm
                  </Button>
                </ButtonWrapper>
              </DateWrapper>
            )}
          </>
        )}
      </DateTimeWrapper>
    </Wrapper>
  );
}
