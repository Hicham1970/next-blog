import Image from 'next/image';

export default function Home() {
  return (
    <div className="container flex flex-col md:flex-row gap-5 h-[calc(100vh-4rem)]">
      <div className="basis-full flex flex-col justify-center md:basis-2/3">
        <p className="special-word text-xs">Protect All the Birds</p>
        <h1 className="pb-5">
          The World's <span className="special-word ">Rarest</span><br /> Birds
        </h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quidem molestias.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quidem molestias.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quidem molestias.  
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

 
