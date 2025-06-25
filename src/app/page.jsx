import Image from 'next/image';

export default function Home() {
  return (
    <div className="container flex flex-col md:flex-row gap-5 h-[calc(100vh-4rem)]">
      <div className="basis-full flex flex-col justify-center md:basis-2/3">
        <p className="special-word text-xs">Protect All the Birds</p>
        <h1 className="pb-5">
          The World's <span className="special-word ">Rarest</span>
          <br /> Birds
        </h1>
        <p>
          Qu'ils soient en danger critique
          d'extinction ou simplement peu communs, les oiseaux rares suscitent un intérêt
          particulier. Leur rareté peut être due à des facteurs variés, tels que
          la destruction de leur habitat, la chasse excessive, ou des maladies.
          Parmi les oiseaux les plus rares, on trouve le Tuit-tuit, endémique de
          la Réunion et dont l'observation est difficile en raison de sa
          discrétion. La Grue blanche d'Amérique, quant à elle, a failli
          disparaître au 20ème siècle, mais des efforts de conservation ont
          permis de sauver l'espèce. Le Pygargue à queue blanche, un grand
          rapace, est également considéré comme rare en France, où il a disparu
          de la reproduction avant de réapparaître.
        </p>
      </div>
      <div className=" hidden md:block basis-1/3 mt-12">
        <Image
          src="/img/ara3.png"
          alt="Ara"
          width={500}
          height={500}
          className="object-cover h-full w-full md:h-[500px] md:w-[500px]"
        />
      </div>
    </div>
  );
}

 
