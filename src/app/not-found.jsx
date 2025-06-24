import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


const NotFound = () => {
    return (
      <div className="container flex flex-col gap-5 h-screen text-red-600 items-center justify-center">
        <Image src="/img/404.jpg" alt="Page Not Found" width={300} height={200} />
            <h1>404 - Page non trouvée</h1>
        <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <Link href="/" className="text-blue-500 hover:underline">Retour à l'accueil</Link>
      </div>
    );
}

export default NotFound
