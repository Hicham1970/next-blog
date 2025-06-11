// "use client";

import CreatePost from "@/components/CreatePost";
import { useUser } from "@clerk/nextjs";

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser(); 


  if (!isLoaded) {
    return null;
  }

  if (!user) {
    return <div>Vous devez être connecté pour créer un nouveau post</div>;
  }

  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <CreatePost />
    );
  } else {
    return (
      <h1 className="text-center text-3xl my-7 font-semibold">
        You are not authorized to view this page
      </h1>
    );
  }
}
