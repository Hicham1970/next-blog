"use client";

import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { ThemeCompo } from "@/app/components/ThemeCompo";
import { CreatePost } from "@/app/components/CreatePost";
import SignInPage from "@/app/sign-in/[[...sign-in]]/page";

export default function CreatePostPage() {
  const { theme, setTheme } = useTheme();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn || !user.publicMetadata.isAdmin) {
    <SignInPage />;
  } else {
    return (
      <ThemeCompo>
        <CreatePost />
      </ThemeCompo>
    );
  }
}
