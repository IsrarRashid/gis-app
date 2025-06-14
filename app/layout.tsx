import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "./Navbar";
import BgChanger from "./components/BgChanger";
import BootstrapClient from "./components/BootstrapClient";
import ReduxProvider from "./components/ReduxProvider";
import ToastContainers from "./components/ToastContainers";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RTMES",
  description: "Created by DGME",
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
          <Navbar />
          <main className="p-2">{children}</main>
        </ReduxProvider>
        <BootstrapClient />
        <ToastContainers />
      </body>
    </html>
  );
}
