import { withCommonProps } from "next-common/lib";
import Reset from "next-common/components/pages/reset";
import { useState } from "react";

export default function Login() {
  const [data, setData] = useState([1, 2, 3, 4, 5]);
  return (
    <>
      <h1>test</h1>
      {data.map((item) => (
        <div key={item}>
          <p>{item}</p>
        </div>
      ))}
      <button
        onClick={() => {
          setData({});
        }}
      >
        create error
      </button>
    </>
  );
}

// export default Reset;

export const getServerSideProps = withCommonProps();
