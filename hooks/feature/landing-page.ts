import { useState } from "react";
import LANDING_PAGE_DATA from "@/locales/landing.json";

export const LANDING_PAGE_INITIAL_DATA = LANDING_PAGE_DATA;

export const useLandingPageData = () => {
  const [data, setData] = useState(LANDING_PAGE_INITIAL_DATA);

  return {
    data,
    setData,
  };
};
