import { getAllPublicCategories } from "@/features/categories/server.action";
import Image from "next/image";

import Link from "next/link";
import React from "react";

const Page = async () => {
  const cats = await getAllPublicCategories({});

  return (
    <div>
      <div className="flex flex-wrap gap-8">
        {cats.data?.map((t, i) => (
          <Link
            href={"document/" + t.slug}
            key={i}
            style={{
              width: "12rem",
              height: "16rem",
            }}
          >
            <div className="border rounded-md overflow-hidden mb-1">
              <Image
                key={i}
                src={"/docs.png"}
                alt=""
                width={300}
                height={300}
                quality={100}
              />
            </div>
            <p className="font-medium text-muted-foreground">
              Title of the document
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
