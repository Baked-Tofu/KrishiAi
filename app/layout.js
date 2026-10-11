import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppFrame from "./components/AppFrame";

const font = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "KrishiAi",
  description: "Multilingual voice assistant for cooperative governance and rural services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${font.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
