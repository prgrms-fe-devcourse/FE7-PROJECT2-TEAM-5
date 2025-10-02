import { Outlet } from "react-router";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export default function MainLayout() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* 헤더 영역 */}
        <Header />
        {/* 사이드바 + 메인 */}
        <div className="flex-1 flex w-[1440px] mx-auto">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
