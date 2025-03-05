import { redirect, RedirectType } from "next/navigation";

export default function page() {
  return redirect("/app", RedirectType.replace);
}
