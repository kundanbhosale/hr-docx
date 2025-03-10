import { LoginForm } from "@/features/auth/client/comp.login";
import { Suspense } from "react";
export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
