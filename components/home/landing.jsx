import Balancer from "react-wrap-balancer";

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
      <div className="flex-grow mt-32"></div>

      {/* Heading */}
      <h1
        className="grow mt-32 animate-fade-up bg-gradient-to-br from-slate-300 to-slate-200 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-8xl md:leading-[7rem]"
        style={{
          animationDelay: "0.15s",
          animationFillMode: "forwards",
          textShadow: "0 0 20px rgba(238, 238, 238, 0.3), 0 0 0px rgba(238, 238, 238, 0.5), 0 0 60px rgba(238, 238, 238, 0.3)",
        }}
      >
        <Balancer>Ұлы Дала Тарихын <br /> Тұлғалармен <br /> Таны</Balancer>
      </h1>

      {/* Subheading */}
      <p
        className="mt-4 mb-2 animate-fade-up text-center text-white opacity-0 md:text-xl"
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

      {/* Developer information */}
      <div className="flex text-white bg-stone-800 w-full py-0 rounded-top justify-between">
        <div className="pl-4">
          <p>Developed by: Zholdybay Altynbek</p>
          <p>Email: altynbek4649@gmail.com</p>
        </div>
        <div className="block md:flex my-2 md:space-x-2">
          {/* Instagram Icon */}
          <a
            href="https://instagram.com/altynbek_40?utm_source=qr&igshid=NGExMmI2YTkyZg%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="w-8 h-8" src="/instagram_zinc.png" alt="Instagram Icon"></img>
          </a>
          {/* LinkedIn Icon */}
          <a
            href="https://www.linkedin.com/in/altynbek-zholdybay-9b8b27254/"
            target="_blank"
            rel="noopener noreferrer"
            className=""
          >
            <img className="w-8 h-8" src="/linkedin_white.png" alt="LinkedIn Icon"></img>
          </a>
        </div>
      </div>
    </div>
  );
}
