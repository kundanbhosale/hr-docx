import { CategoryList } from "@/features/categories/client.list";
import { getAllPublicCategories } from "@/features/categories/server.action";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const cat = await getAllPublicCategories({});

  return (
    <div className="grid grid-cols-[275px,auto] gap-8 flex-1">
      <div className="flex flex-1">
        <CategoryList data={cat} />
      </div>
      <div className="flex-1 ">{children}</div>
    </div>
  );
};

export default Layout;
