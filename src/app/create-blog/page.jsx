"use client";

import InputCompo from "@/components/InputCompo";
import TextAreaCompo from "@/components/TextAreaCompo";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Import useSession to check authentication status
import { useRouter } from "next/navigation"; // Import useRouter to navigate programmatically
import Image from "next/image";

// pour envoyer les données du formulaire à l'API
const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  category: "Nextjs",
  photo: "",
};

function CreateBlog() {
  const CLOUD_NAME = "doh12ravy";
  const UPLOAD_PRESET = "nextjs_blog_images";

  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "unauthenticated") {
    return "Access Denied";
  }

  const handleChange = (e) => {
    setError("");
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setState({ ...state, [name]: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { photo, title, category, description, excerpt, quote } = state;

    if (!title || !description || !excerpt || !quote || !photo) {
      setError("Please fill out all required fields!");
      return;
    }
    if (photo) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (photo.size > maxSize) {
        setError("Image size should be less than 5MB!");
        return;
      }
    }

    if (title.length < 4) {
      setError("Title must be at least 4 characters long!");
      return;
    }
    if (description.length < 20) {
      setError("Description must be at least 20 characters long!");
      return;
    }
    if (excerpt.length < 10) {
      setError("Excerpt must be at least 10 characters long!");
      return;
    }
    if (quote.length < 6) {
      setError("Quote must be at least 6 characters long!");
      return;
    }

    // manage images with cloudinary
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");
      const image = await uploadImage();

      const newBlog = {
        title,
        description,
        excerpt,
        quote,
        category,
        image,
        authorId: session?.user?._id,
      };

      const response = await fetch("http://localhost:3000/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      
        body: JSON.stringify(newBlog),
      });
      if (response?.status === 201) {
        setSuccess("Blog created successfully !");
        setTimeout(() => {
          router.refresh();
          router.push("/blog");
        }, 1500);
      } else {
        setError("erreur pendant la creation du blog");
      }
    } catch (error) {
      console.log(error);
      setError("Error  while creating blog");
    }
    setIsLoading(false);
  };

  const uploadImage = async () => {
    if (!state.photo) return;

    const formData = new FormData();

    formData.append("file", state.photo);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      const image = {
        id: data["public_id"],
        url: data["secure_url"],
      };
      return image;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="container max-x-3xl">
      <h2 className="mb-5">
        <span className="special-word">Create</span>Blog
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputCompo
          label="Title"
          placeholder="Enter your title here"
          type="text"
          name="title"
          onChange={handleChange}
          value={state.title}
        />

        <TextAreaCompo
          label="Description"
          placeholder="Enter the description here"
          rows="4"
          name="description"
          onChange={handleChange}
          value={state.description}
        />
        <TextAreaCompo
          label="Excerpt"
          placeholder="Enter the excerpt here"
          rows="2"
          name="excerpt"
          onChange={handleChange}
          value={state.excerpt}
        />
        <TextAreaCompo
          label="Quote"
          placeholder="Enter the quote here"
          rows="2"
          name="quote"
          onChange={handleChange}
          value={state.quote}
        />
        <div>
          <label className="bloc">Select an Option</label>
          <select
            name="category"
            onChange={handleChange}
            value={state.category}
            className="block rounded-lg  w-full bg-white dark:bg-primaryColorLight  py-2 px-3"
          >
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="Javascript">Javascript</option>
            <option value="React">React</option>
            <option value="Nodejs">Nodejs</option>
            <option value="Nextjs">Nextjs</option>
            <option value="Python">Python</option>
            <option value="Mongodb">Mongodb</option>
            <option value="GitHub">GitHub</option>
            <option value="Excel">Excel</option>
            <option value="Ports">Ports</option>
            <option value="Draft Survey">Draft Survey</option>
            <option value="Vessels">Vessels</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Upload Image</label>
          <InputCompo
            onChange={handleChange}
            type="file"
            name="photo"
            accept="image/*"
          />
          {state.photo && (
            <div>
              <Image
                src={URL.createObjectURL(state.photo)}
                priority
                alt="Plimsoll"
                width={100}
                height={100}
                size="100vw"
                className="w-32 mt-5"
              />
            </div>
          )}
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-500 text-center">{success}</div>}

        <button type="submit" className="btn">
          {isLoading ? "Loading..." : "Create Blog"}
        </button>
      </form>
    </section>
  );
}

export default CreateBlog;
