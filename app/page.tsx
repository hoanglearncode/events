import { ROUTES } from "@/shared/const/route";
import { redirect } from "next/navigation";
import type { Metadata } from "next";


export default function HomePage() {
  redirect(ROUTES.HOME);
}
