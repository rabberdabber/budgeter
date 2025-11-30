"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
        Login with Google
      </Button>
    </div>
  );
}
