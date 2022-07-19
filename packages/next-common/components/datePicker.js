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
  * {
    stroke: rgb(30, 33, 52);
  }

  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
      pointer-events: none;
      background: #ebeef4;
      :hover {
        border-color: #e0e4eb;
      }
    `}
`;

const CaretLeft = ({ onClick, disabled }) => {
  return (
    <CaretWrapper disabled={disabled} onClick={onClick}>
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

const PlaceHolder = styled.span`
  padding-left: 16px;
  color: #d7dee8;
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
  placeholder,
  maxDate,
  button,
  onSelectDatetime = () => {},
}) {
  const [date, setDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState("date");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const ref = useRef();
  useOnClickOutside(ref, () => setIsOpen(false));
  const handleChange = (e) => {
    setDate(e);
  };
  const handleClick = (e) => {
    e.preventDefault();
    setShow("date");
    setIsOpen(!isOpen);
  };

  const getFormattedTime = () => {
    if (!date || !hour || !minute) return "";
    const datetime = new Date(
      Date.parse(
        `${moment(date ?? new Date()).format("YYYY-MM-DD")} ${hour}:${minute}`
      )
    );
    return moment(datetime).format("YYYY-MM-DD, HH:mm");
  };

  return (
    <Wrapper ref={ref}>
      <DateTimeWrapper>
        {button ? (
          <div onClick={handleClick}>{button}</div>
        ) : (
          <DateButton onClick={handleClick} active={isOpen}>
            <Label>End time</Label>
            {date ? (
              <DateTime>{getFormattedTime()}</DateTime>
            ) : (
              <PlaceHolder>{placeholder}</PlaceHolder>
            )}
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
                        <CaretLeft
                          disabled={
                            moment(date).format("YYYY-MM") ===
                            moment(new Date()).format("YYYY-MM")
                          }
                          onClick={decreaseMonth}
                        />
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
                  <Input
                    type="number"
                    value={hour}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (0 <= value && value < 24) {
                        setHour(value.toString());
                      }
                      if (e.target.value === "") {
                        setHour("");
                      }
                    }}
                    placeholder="00"
                  />
                  <span>:</span>
                  <Input
                    type="number"
                    value={minute}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (0 <= value && value < 60) {
                        setMinute(value.toString());
                      }
                      if (e.target.value === "") {
                        setMinute("");
                      }
                    }}
                    placeholder="00"
                  />
                </TimeWrapper>
                <ButtonWrapper>
                  <Button
                    primary
                    disabled={hour === "" || minute === ""}
                    onClick={() => {
                      if (!date) {
                        setDate(new Date());
                      }
                      onSelectDatetime(
                        Date.parse(
                          `${moment(date ?? new Date()).format(
                            "YYYY-MM-DD"
                          )} ${hour}:${minute}`
                        )
                      );
                      setIsOpen(false);
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
