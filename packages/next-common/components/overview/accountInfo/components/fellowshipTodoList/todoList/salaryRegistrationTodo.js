import {
  useIsImported,
  useIsSalaryRegistered,
  useMySalary,
} from "../context/hooks/mine";
import useIsSalaryRegistrationOpening from "../context/hooks/salary";
import ClickableText from "./clickableText";
import TodoTag from "./todoTag";

export default function SalaryRegistrationTodo() {
  const isInRegistrationPeriod = useIsSalaryRegistrationOpening();
  const isImported = useIsImported();
  const isSalaryRegistered = useIsSalaryRegistered();
  const mySalary = useMySalary();

  if (
    !isInRegistrationPeriod ||
    !isImported ||
    isSalaryRegistered ||
    !mySalary
  ) {
    return null;
  }

  return (
    <div className="flex items-center">
      <TodoTag>Salary</TodoTag>
      <div className="text-textPrimary text14Medium">
        Fellowship salary is opening for registration,&nbsp;
        <ClickableText onClick={() => {}}>Register now</ClickableText>
      </div>
    </div>
  );
}
