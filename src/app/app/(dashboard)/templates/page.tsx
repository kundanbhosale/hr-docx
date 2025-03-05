import { getPublicTemplates } from "@/features/templates/server.action";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Page = async () => {
  const data = await getPublicTemplates({ search: "" });

  return (
    <div className="grid grid-cols-[200px,auto] gap-8">
      <div className="grid h-fit sticky top-10">
        {data.data?.map((k, i) => (
          <Fragment key={i}>
            <Link
              href={"#" + (k.group.slug || "un-categorized")}
              className="px-4 py-2 rounded-md hover:bg-muted cursor-pointer h-fit"
            >
              {k.group.title || "Un-categorized"}
            </Link>
          </Fragment>
        ))}
      </div>
      <div className="grid gap-24">
        {data.data?.map((k, i) => (
          <Fragment key={i}>
            <div
              className="grid"
              id={k.group.slug || "un-categorized"}
              // whileInView={{}}
            >
              <div>
                <h1
                  className="text-lg font-semibold py-1 px-4 mb-8"
                  style={{ background: k.group.color || "#eee" }}
                >
                  {k.group.title || "Un-categorized"}
                </h1>
              </div>
              <div className="flex flex-wrap gap-8">
                {k.templates.map((t, idx) => (
                  <Link
                    href={"document/" + t.slug}
                    key={i}
                    className="block"
                    style={{ width: "12rem" }}
                  >
                    <div
                      className="border rounded-md overflow-hidden mb-1 relative"
                      style={{
                        height: "16rem",
                      }}
                    >
                      <Image
                        key={idx}
                        src={"/docs.png"}
                        alt=""
                        fill
                        quality={100}
                      />
                    </div>
                    <p className="block w-full font-medium text-muted-foreground break-words">
                      {t.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Page;
