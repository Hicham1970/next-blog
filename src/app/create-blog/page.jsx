"use client";

import InputCompo from "@/components/InputCompo"; 
import TextAreaCompo from "@/components/TextAreaCompo"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Import useSession to check authentication status
import { useRouter } from "next/navigation"; // Import useRouter to navigate programmatically
import Image from 'next/image'


// pour envoyer les données du formulaire à l'API
const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote:"",
  category: "Nextjs",
  photo:"",
};



function CreateBlog() {
  const [hydrated, setHydrated] = useState(false);
    const [state, setState] = useState(initialState);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {data:session,status } = useSession();


    if(status==="loading") {
      return <p>Loading...</p>
    }
    if(status === "unanuthenticated") {
      return ("Access Denied")
    }
    
    const handleChange = (e) => {
      setError("");
      const {name, value, type, files} = event.target; 

      if (type === 'file') {
        setState({...state, [name]:files[0]})
      }else{
        setState({...state, [name]: value})
      }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    const { photo, title, category, description, excerpt, quote } = state; 
    
    if (!title || !description || !excerpt || !quote || !photo) {
      setError('Please fill out all required fields!');
      return
    }
    if (photo) {
      const maxSize = 5* 1024 * 1024; // 5MB in bytes
     if(photo.size > maxSize){
      setError('Image size should be less than 5MB!');
      return; 
    }
    }
    
    if (title.length < 4) {
      setError('Title must be at least 4 characters long!');
      return;
    }
    if (description.length < 20) {
      setError('Description must be at least 20 characters long!');
      return;
    }
    if (excerpt.length < 10) {
      setError('Excerpt must be at least 10 characters long!');
      return;
    }
    if (quote.length < 6) {
      setError('Quote must be at least 6 characters long!');
      return;
    }

}  
  return (
    <section className="container max-x-3xl">
      <h2 className="mb-5">
        <span className="special-word">Create</span>Blog
      </h2>
      <form className="space-y-5">
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
            <option value="Nextjs">Nextjs</option>
            <option value="React">React</option>
            <option value="Javascript">Javascript</option>
            <option value="Nodejs">Nodejs</option>
            <option value="Express">Express</option>
            <option value="Mongodb">Mongodb</option>
            <option value="Python">Python</option>
            <option value="GitHub">GitHub</option>
            <option value="Excel">Excel</option>
            <option value="Html">Html</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Upload Image</label>
          <InputCompo type="file" name="photo" accept="image/*" />
          <Image
            src="/img/Plimsoll.jpg"
            alt="Plimsoll"
            width={100}
            height={100}
            size="100vw"
            className="w-32 mt-5"
          />
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