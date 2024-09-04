import styled, { css } from "styled-components";
import ReactDatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import ArrowLeft from "../assets/imgs/icons/caret-left-16.svg";
import ArrowRight from "../assets/imgs/icons/caret-right-16.svg";
import Flex from "./styled/flex";
import FlexBetween from "./styled/flexBetween";
import Input from "./input";
import PrimaryButton from "next-common/lib/button/primary";
import Popup from "./popup/wrapper/Popup";
const CaretWrapper = styled.div`
  cursor: pointer;
  padding: 6px 7px 5px 7px;
  border: 1px solid var(--neutral400);
  border-radius: 4px;

  :hover {
    border-color: var(--neutral500);
  }
  * {
    stroke: var(--textPrimary);
  }

  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
      pointer-events: none;
      * {
        stroke: var(--textDisabled);
      }
      :hover {
        border-color: var(--neutral400);
      }
    `}
  * {
    stroke: var(--textPrimary);
  }
`;

const CaretLeft = ({ onClick, disabled }) => {
  return (
    <CaretWrapper className="caret" disabled={disabled} onClick={onClick}>
      <ArrowLeft />
    </CaretWrapper>
  );
};

const CaretRight = ({ onClick }) => {
  return (
    <CaretWrapper className="caret" onClick={onClick}>
      <ArrowRight />
    </CaretWrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 8px;
  position: relative;
`;

const DateTimeWrapper = styled.div``;

const Label = styled.span`
  width: 91px;
  line-height: 36px;
  background: var(--neutral200);
  border-right: 1px solid var(--neutral400);
  text-align: center;
  color: var(--textPrimary);
`;

const DateTime = styled.span`
  padding-left: 16px;
  flex-grow: 1;
  text-align: left;
  color: var(--textPrimary);
`;

const PlaceHolder = styled.span`
  padding-left: 16px;
  flex-grow: 1;
  text-align: left;
  color: var(--textDisabled);
`;

const DateButton = styled.div`
  overflow: hidden;
  padding-right: 12px;
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  background: var(--neutral100);

  :hover {
    border-color: var(--neutral300);
  }

  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;

  .placeholder {
    color: var(--textTertiary);
  }

  > div {
    flex-grow: 1;
  }

  ${(p) =>
    p.active &&
    css`
      border-color: var(--neutral400);
    `}
`;

const DateHeader = styled(Flex)`
  margin-bottom: 8px;

  > b {
    font-family: Inter;
    text-align: center;
    color: var(--textPrimary);
    flex: 1 1 auto;
  }

  > svg {
    cursor: pointer;

    path {
      fill: var(--textSecondary);
    }
  }
`;

const ButtonWrapper = styled(Flex)`
  margin-top: 16px;
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
  const now = new Date();
  const [date, setDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState("date");
  const [hour, setHour] = useState(now.getHours());
  const [minute, setMinute] = useState(now.getMinutes());

  const handleChange = (e) => {
    setDate(e);
  };
  const handleClick = (e) => {
    e.preventDefault();
    setShow("date");
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen && date === null) {
      setDate(new Date(now.setDate(now.getDate() + 7)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const getFormattedTime = () => {
    if (!date || !hour || !minute) return "";
    const datetime = new Date(
      Date.parse(
        `${dayjs(date ?? new Date()).format("YYYY-MM-DD")} ${hour}:${minute}`,
      ),
    );
    return dayjs(datetime).format("YYYY-MM-DD, HH:mm");
  };

  return (
    <Wrapper>
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
              <Popup
                title="Select Time"
                onClose={() => {
                  setIsOpen(false);
                }}
              >
                <div>
                  <h6 className="text12Bold mb-2 text-textPrimary">Date</h6>
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
                              dayjs(date).format("YYYY-MM") ===
                              dayjs(new Date()).format("YYYY-MM")
                            }
                            onClick={decreaseMonth}
                          />
                          <b className="text14Bold">
                            {dayjs(date).format("YYYY-MM")}
                          </b>
                          <CaretRight onClick={increaseMonth} />
                        </DateHeader>
                      </div>
                    )}
                    formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
                  />
                </div>

                <div>
                  <FlexBetween className="mb-2">
                    <h6 className="text12Bold text-textPrimary">Time</h6>
                    <span className="text12Medium text-textTertiary">
                      24-hour clock
                    </span>
                  </FlexBetween>
                  <TimeWrapper>
                    <Input
                      className="input"
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
                      className="input"
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
                </div>

                <ButtonWrapper>
                  <PrimaryButton
                    disabled={hour === "" || minute === ""}
                    onClick={() => {
                      if (!date) {
                        setDate(new Date());
                      }
                      onSelectDatetime(
                        Date.parse(
                          `${dayjs(date ?? new Date()).format(
                            "YYYY-MM-DD",
                          )} ${hour}:${minute}`,
                        ),
                      );
                      setIsOpen(false);
                    }}
                  >
                    Confirm
                  </PrimaryButton>
                </ButtonWrapper>
              </Popup>
            )}
          </>
        )}
      </DateTimeWrapper>
    </Wrapper>
  );
}
