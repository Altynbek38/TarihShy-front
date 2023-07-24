import Balancer from "react-wrap-balancer";
import { DEPLOY_URL } from "@/lib/constants";

export default function Landing() {
  return (
    // JSX code starts here
    <>
      {/* Background Image */}
      <div
        className="overscroll-none z-10 w-full min-h-screen flex flex-col justify-center items-center px-5 xl:px-0"
        style={{
          backgroundImage: `url('photo_388960.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Heading */}
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Balancer>Ұлы Дала Тарихын <br/> Тұлғалармен <br /> Таны</Balancer>
        </h1>
        
        {/* Subheading */}
        <p
          className="mt-4 animate-fade-up text-center text-gray-500 opacity-0 md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <Balancer>
            Қазақстан Тарихын Тарихи Тұлғалармен Таны.
          </Balancer>
        </p>
        
        {/* Other content (not provided in the code) */}
        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          {/* Additional content might go here */}
        </div>
      </div>
    </>
  )
}