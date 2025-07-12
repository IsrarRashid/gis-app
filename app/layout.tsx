import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import BgChanger from "./components/BgChanger";
import BootstrapClient from "./components/BootstrapClient";
import NavbarToggle from "./components/NavbarToggle";
import ReduxProvider from "./components/ReduxProvider";
import ToastContainers from "./components/ToastContainers";
import "./globals.css";
import { Suspense } from "react";
import Loader from "./components/Loader";
import FooterToggle from "./components/FooterToggle";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RTMES",
  description: "Created by DGME",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ReduxProvider>
          <Suspense fallback={<Loader />}>
            <BgChanger />
            <NavbarToggle />
          </Suspense>
          <main className="p-2">{children}</main>
          <Suspense fallback={<Loader />}>
            <FooterToggle />
          </Suspense>
        </ReduxProvider>
        <BootstrapClient />
        <ToastContainers />
      </body>
    </html>
  );
}
