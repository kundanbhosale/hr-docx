"use client";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useTransition } from "react";
import { signIn } from "./helpers";
import { toast } from "sonner";
import { parseAsString, useQueryState } from "nuqs";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [pending, trans] = useTransition();
  const [verifyEmail, setVerifyEmail] = useQueryState(
    "verify-email",
    parseAsString
  );
  const handler = (p: Parameters<typeof signIn>) => {
    trans(async () => {
      await signIn(...p)
        .then(() => {
          if (p[0] === "magic-link" && p[1]?.email) {
            return setVerifyEmail(p[1]?.email);
          }
        })
        .catch((e) => {
          toast.error(e.message || "Something went wrong.");
        });
    });
  };
  const handleForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const email = formdata.get("email")?.toString();
    if (!email) return toast.error("Invalid email: " + email);
    handler(["magic-link", { email }]);
  };

  if (verifyEmail) {
    return (
      <Card className="pt-10">
        <CardHeader className="text-center">
          <CardTitle className="text-xl flex items-center justify-center flex-col">
            <>
              <CheckCircle2 className="size-16 mb-6" />
              <span>Link Sent</span>
            </>
          </CardTitle>
          <CardDescription>
            We've sent you an email with login link on {verifyEmail}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center my-10 justify-center gap-4">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            <ArrowLeft /> Go Back
          </Link>
          <Button
            variant={"secondary"}
            size={"lg"}
            onClick={() => handler(["magic-link", { email: verifyEmail }])}
          >
            Resend Email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Microsoft or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForm}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={pending}
                  onClick={() => handler(["microsoft"])}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    viewBox="0 0 16 16"
                    id="microsoft"
                  >
                    <path
                      fill="#4CAF50"
                      d="M8.5 7.5H16v-7a.5.5 0 0 0-.5-.5h-7v7.5z"
                    ></path>
                    <path
                      fill="#F44336"
                      d="M7.5 7.5V0h-7a.5.5 0 0 0-.5.5v7h7.5z"
                    ></path>
                    <path
                      fill="#2196F3"
                      d="M7.5 8.5H0v7a.5.5 0 0 0 .5.5h7V8.5z"
                    ></path>
                    <path
                      fill="#FFC107"
                      d="M8.5 8.5V16h7a.5.5 0 0 0 .5-.5v-7H8.5z"
                    ></path>
                  </svg>
                  Login with Microsoft
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={pending}
                  onClick={() => handler(["google"])}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2443"
                    height="2500"
                    preserveAspectRatio="xMidYMid"
                    viewBox="0 0 256 262"
                    id="google"
                  >
                    <path
                      fill="#4285F4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    ></path>
                    <path
                      fill="#EB4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    ></path>
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                {/* <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div> */}
                <Button type="submit" className="w-full" disabled={pending}>
                  Login with Email
                </Button>
              </div>
              {/* <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div> */}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
