import "./globals.css";
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Nav from "@/components/layout/nav";
import { Suspense } from "react";

export const metadata = {
  title: "My First Project",
  description:
    "Meet your AI Jeopardy expert.",
  themeColor: "#FFF",
};

// iOS Safari viewport unit correction
const IOS_SAFARI_VIEWPORT_UNIT_CORRECTION = `
var customViewportCorrectionVariable = 'vh';

function setViewportProperty(doc) {
  var prevClientHeight;
  var customVar = '--' + ( customViewportCorrectionVariable || 'vh' );
  function handleResize() {
    var clientHeight = doc.clientHeight;
    if (clientHeight === prevClientHeight) return;
    requestAnimationFrame(function updateViewportHeight(){
      doc.style.setProperty(customVar, (clientHeight * 0.01) + 'px');
      prevClientHeight = clientHeight;
    });
  }
  handleResize();
  return handleResize;
}
window.addEventListener('resize', setViewportProperty(document.documentElement));
`;

export default async function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <Script id="safari-viewport-fix">{IOS_SAFARI_VIEWPORT_UNIT_CORRECTION}</Script>
      <body className={cx(sfPro.variable, inter.variable)}>
        <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
        <Suspense fallback="...">
          <Nav />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center pt-16 relative">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
