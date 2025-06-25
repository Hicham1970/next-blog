"use client"; 

import InputCompo from './InputCompo';
import Link from 'next/link';
import { useState, useEffect } from 'react'; 

const LoginForm = () => {
    const [hydrated, setHydrated] = useState(false)
  
    useEffect(() => {
      setHydrated(true)
    }, [])
  
    if (!hydrated) {
      return null; // Render nothing until the component is hydrated
  }
  
    return (
      <section className="container ">
        <form className="border-2  border-paragraphColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5 ">
          <h2 className="text-center special-word">Login</h2>
          <InputCompo label="Email" type="text" name="email" />
          <InputCompo label="Password" type="password" name="password" />
          <button type="submit" className="btn w-full">
            Login 
          </button>
          <p className="text-center">
            You don't have an account? {""}
            <Link
              href="/signup"
              className="text-center text-primaryColorLight hover:text-primaryColor dark:text-primaryColor
                dark:hover:text-white"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </section>
    );
}

export default LoginForm


