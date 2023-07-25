import Balancer from "react-wrap-balancer";
import { DEPLOY_URL } from "@/lib/constants";

export default function Landing() {
  return (
    // JSX code starts here
    <div
      className="overscroll-none z-10 w-full min-h-screen flex flex-col justify-center items-center px-auto"
      style={{
        backgroundImage: `url('photo_388960.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Empty div to push the content slightly down */}
      <div className="flex-grow mt-32">
        
      </div>

      {/* Heading */}
      <h1
  className="grow mt-64 animate-fade-up bg-gradient-to-br from-slate-300 to-slate-200 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-8xl md:leading-[7rem]"
  style={{
    animationDelay: "0.15s",
    animationFillMode: "forwards",
    textShadow: "0 0 20px rgba(238, 238, 238, 0.3), 0 0 0px rgba(238, 238, 238, 0.5), 0 0 60px rgba(238, 238, 238, 0.3)",
  }}
>
  <Balancer>Ұлы Дала Тарихын <br/> Тұлғалармен <br /> Таны</Balancer>
</h1>

      {/* Subheading */}
      <p
        className="mt-4 mb-2 animate-fade-up text-center text-slate-100 opacity-0 md:text-xl"
        style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
      >
        <Balancer>
            Жасанды интеллект негізінде Қазақстан тарихын зерделеу үшін жасалған Веб-қосымша
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
  );
}
