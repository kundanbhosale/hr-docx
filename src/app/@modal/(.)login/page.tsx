import React from "react";
import { Modal } from "../modal";
import { LoginForm } from "@/features/auth/client/comp.login";

export default function Login() {
  return (
    <Modal>
      <LoginForm />
    </Modal>
  );
}
