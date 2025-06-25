"use client";
import InputCompo from "./InputCompo";
import Link from "next/link";
import { useState, useEffect } from "react";
import {useRouter} from 'next/navigation'; // Import useRouter to navigate programmatically

// pour envoyer les données du formulaire à l'API
const initialState = {
  name: "",
  email: "",
  password: "",
};

const SignUpForm = () => {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null; // Render nothing until the component is hydrated
  }

  const handleChange = (e) => {
    setError("");
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const { name, email, password } = state;
    // Basic validation
    if (!name || !email || !password) {
      setError("All fields are required!");
      setIsLoading(false);
      return;
    }
    // regular expression pattern for a basic email validation
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(email)) {
      setError('Please enter a valid email address!');
      setIsLoading(false);
      return;
     }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      setIsLoading(false);
      return;
     }

    try {
      const newUser = { name, email, password };
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if(response?.status === 201) {
        setSuccess("Sign up successful! Please log in.");

        setTimeout(() => {
          router.push("/login", { scroll: false }); // Redirect to login page after success & scroll to top
         },1000)

        setState(initialState); // Reset form state
      } else {
        setError(errorData.error || "Sign up failed. Please try again.");
      }
      
    } catch (error) {
      console.error("Error during sign up:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
   }

  return (
    <section className="container ">
      <form onSubmit={handleSubmit} className="border-2  border-paragraphColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5 ">
        <h2 className="text-center special-word">Sign Up</h2>
        <InputCompo label="Name" type="text" name="name" onChange={handleChange} value={state.name} />
        <InputCompo label="Email" type="text" name="email" onChange={handleChange} value={state.email} />
        <InputCompo label="Password" type="password" name="password" onChange={handleChange} value={state.password} />

        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-500 text-center">{success}</div>}

        <button type="submit" className="btn w-full">
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
        <p className="text-center">
          Already have an account? {""}
          <Link
            href="/login"
            className="text-center text-primaryColorLight hover:text-primaryColor dark:text-primaryColor
              dark:hover:text-white"
          >
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};
export default SignUpForm;
