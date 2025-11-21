import { useState, useMemo, useEffect } from "react";
import { isEmpty, isNil } from "lodash-es";
import { useRegistrarContext } from "next-common/context/people/registrarContext";
import useJudgementsData from "next-common/components/people/overview/hooks/useJudgementsData";

export default function useDefaultRegistrar(defaultRegistrarIndex) {
  const { registrars } = useRegistrarContext();
  const { data = [] } = useJudgementsData();
  const [dafaultValue, setDefaultValue] = useState(null);

  const selectableRegistrars = useMemo(() => {
    if (isEmpty(registrars) || isEmpty(data)) {
      return [];
    }

    return registrars?.filter(
      (s) => !data.some((r) => r.account === s.account),
    );
  }, [data, registrars]);

  const defaultRegistrarObj = useMemo(() => {
    if (isEmpty(selectableRegistrars)) {
      return null;
    }

    return selectableRegistrars?.find(
      (registrar) => String(registrar?.index) === defaultRegistrarIndex,
    );
  }, [selectableRegistrars, defaultRegistrarIndex]);

  useEffect(() => {
    if (isNil(defaultRegistrarObj)) {
      return;
    }

    setDefaultValue(defaultRegistrarObj?.account);
  }, [defaultRegistrarObj]);

  return dafaultValue;
}
