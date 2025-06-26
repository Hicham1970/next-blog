import React from 'react'
import SignUpForm from '@/components/SignUpForm'
import {getServerSession} from 'next-auth'
import {redirect} from 'next/navigation'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'  

const SignUp = async ()=> {
  const session = await getServerSession(authOptions)
  if (session) redirect('/blog')
  
  return ( 
    <>    
      <SignUpForm />
    </>
  )
}

export default SignUp
