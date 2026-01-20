import { ACCESS_TOKEN } from "@/shared/const/cookie";
import Cookies from "js-cookie";
export function useAccessToken() {
  return Cookies.get(ACCESS_TOKEN) ?? null;
}
