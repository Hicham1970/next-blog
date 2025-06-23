"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      // Redirige vers dashboard ou autre page après connexion
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex items-center justify-center text-center font-semibold text-2xl text-red-500">
      <SignIn />
    </div>
  );
}
