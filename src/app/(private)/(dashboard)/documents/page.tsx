import { CreateBtn } from "@/features/documents/components/createbtn";
import { getAllDocuments } from "@/features/documents/server.action";
import Image from "next/image";

import Link from "next/link";
import React from "react";

const Page = async () => {
  const data = await getAllDocuments({});
  console.log(data);
  return (
    <div>
      <div className="flex flex-wrap gap-8">
        <CreateBtn />
        {data.data?.map(({ document: t }, i) => (
          <Link
            href={"document/" + t.id}
            key={i}
            style={{
              width: "12rem",
            }}
          >
            <div
              className="border rounded-md overflow-hidden mb-1"
              style={{
                height: "16rem",
                overflow: "hidden",
              }}
            >
              <img
                key={i}
                src={t.thumbnail || "/docs.png"}
                alt=""
                width={300}
                height={300}
              />
            </div>
            <p className="font-medium text-muted-foreground truncate">
              {t.title || "Untitled Document"}
            </p>
          </Link>
          // <Link
          //   href={"documents/" + t.slug}
          //   className="relative overflow-hidden border rounded-md bg-muted group"
          //   key={i}
          //   style={{
          //     borderColor: t.color?.toString(),
          //     width: "12rem",
          //     height: "16rem",
          //   }}
          // >
          //   <div
          //     className="h-16 block absolute -top-14 left-0 w-full group-hover:top-0 transition-all ease-in-out"
          //     style={{
          //       background: t.color?.toString(),
          //     }}
          //   />
          //   <p className="text-center uppercase text-md font-semibold py-6 px-4 truncate relative z-10">
          //     {t.title}
          //   </p>
          //   {/* <Image
          //       src={t.thumbnail}
          //       alt={t.title}
          //       width={300}
          //       height={300}
          //       quality={100}
          //     /> */}
          // </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
