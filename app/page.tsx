import { ROUTES } from "@/shared/const/route";
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect(ROUTES.HOME);
}
