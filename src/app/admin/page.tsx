import { redirect, RedirectType } from "next/navigation";

const Documents = () => {
  return redirect("admin/category", RedirectType.replace);
};

export default Documents;
