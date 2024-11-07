import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const showNavbar =
    router.pathname !== "/login" && router.pathname !== "/signup";

  return (
    <>
      {showNavbar && <Navbar />}
      <Component {...pageProps} />;
    </>
  );
}
