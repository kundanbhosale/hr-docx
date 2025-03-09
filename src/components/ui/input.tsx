import { cn } from "@/lib/utils";
import * as React from "react";

// const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );

type InputProps = React.PropsWithChildren<React.ComponentProps<"input">> & {
  icon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, icon, className, type, ...props }, ref) => {
    const classes = cn(
      "flex h-10 item-center w-full gap-x-2 rounded-md border border-input bg-background px-3 py-2 text-sm has-[:focus-visible]:outline-none has-[:focus-visible]:border-primary has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
      className
    );
    return (
      <div className={classes}>
        <span className="flex items-center justify-center">{icon}</span>
        <input
          type={type}
          className="flex-1 h-full outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed"
          ref={ref}
          {...props}
        />
        <div className="flex items-center justify-center">{children}</div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
