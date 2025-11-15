import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  initSantralDataFilters,
  santralDataFilters,
  santralDataList,
  santralLocalFilters,
} from "./types";
import { base64from } from "@/lib/utils";
import { apiPath, externalApi } from "../api/api";

type SantralProviderContextValue = {
  data: santralDataList;
  setData: (data: santralDataList) => void;
};

const SantralProviderContext = createContext<
  SantralProviderContextValue | undefined
>(undefined);
export function SantralProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<santralDataList>([]);
  const localFilter = useRef<santralLocalFilters>({});
  const dataFilter = useRef<santralDataFilters>(initSantralDataFilters());
  function setDataFilter(filter: santralDataFilters) {
    dataFilter.current = filter;
  }
  function setLocalFilter(filter: santralLocalFilters) {
    localFilter.current = filter;
  }

  async function getData(filter: santralDataFilters) {
    const data = await JSON.stringify(filter);
    const x = base64from(data);

    fetch(externalApi() + apiPath.santral.list, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        data: x,
      },
    })
      .then((response) => {
        if (response.status != 200) {
          response.json().then((error) => {
            alert(error);
          });
        } else
          response.json().then((d) => {
            setData(d);
          });
      })
      .catch((error) => alert(error.message));
  }

  useEffect(() => {}, []);

  return (
    <SantralProviderContext
      value={{
        data,
        setData,
      }}
    >
      {children}
    </SantralProviderContext>
  );
}

export function useSantral() {
  const context = useContext(SantralProviderContext);
  if (!context) {
    throw new Error("useSantral,  <SantralProvider> içinde kullanılabilir.!");
  }
  return context;
}
