import "./globals.css";
import {Navbar} from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "@/components/Auth/Auth";
import { ToastContainer } from "./toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ CSS import

export const metadata = {
  title: "Stock Tracker",
  description: "Real-Time Stock Portfolio Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-orange-50 text-black">
        <AuthProvider>
        <Navbar />
        {children}
        <Footer />
        <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
