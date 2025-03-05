import "server-only";
import { headers } from "next/headers";

export const getHost = async () => {
  const headerList = await headers();
  // for (const [key, value] of headerList.entries()) {
  //   console.log(`${key}: ${value}`);
  // }
  return (
    headerList.get("x-forwarded-proto") +
    "://" +
    (headerList.get("x-forwarded-host") || headerList.get("host") || "")
  );
};

export const getPath = async () => {
  const headerList = await headers();

  return await headerList.get("x-current-path");
};
