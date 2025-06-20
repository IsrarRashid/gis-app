import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "./Navbar";
import BgChanger from "./components/BgChanger";
import BootstrapClient from "./components/BootstrapClient";
import ReduxProvider from "./components/ReduxProvider";
import ToastContainers from "./components/ToastContainers";
import "./globals.css";
import NavbarToggle from "./components/NavbarToggle";

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
          <BgChanger />
          <NavbarToggle>{children}</NavbarToggle>
          <footer className="text-white bg-color-sea-blue text-center py-1">
            Copyright &copy; All Rights Reserved - DGM&E
          </footer>
        </ReduxProvider>
        <BootstrapClient />
        <ToastContainers />
      </body>
    </html>
  );
}
