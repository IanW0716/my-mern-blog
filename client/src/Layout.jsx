import Header from "./Header.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800 via-white to-white">
            <main className="p-[10px] max-w-[920px] mx-auto">
                <Header />
                <Outlet />
            </main>
        </div>
    )
}