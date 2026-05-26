import {
  TodoContent,
  TodoTag,
  TodoWrapper,
} from "../fellowshipTodoList/todoList/styled";

export default function UpcomingEventItem({ event }) {
  return (
    <TodoWrapper>
      <TodoTag>{event.tag}</TodoTag>
      <TodoContent>{event.content}</TodoContent>
    </TodoWrapper>
  );
}
