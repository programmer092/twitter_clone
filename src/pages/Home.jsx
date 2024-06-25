import LeftSidebar from "../components/LeftSidebar/LeftSidebar";
import MiddleSection from "../components/NewsFeed/MiddleSection";
import RightSidebar from "../components/RightSidebar/RightSidebar";
import BottomBar from "../components/LeftSidebar/BottomBar";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-12 gap-0.5">
        <div className="col-span-12 hidden h-screen bg-black sm:col-span-1 sm:block custom:col-span-2">
          <LeftSidebar />
        </div>
        <div className="fixed bottom-0 left-0 z-50 block w-full sm:hidden">
          <BottomBar />
        </div>

        <div className="relative col-span-12 h-screen bg-black pb-12 sm:col-span-11 sm:pb-0 custom1:col-span-7 custom:col-span-6">
          <MiddleSection />
        </div>
        <div className="hidden h-screen bg-black custom1:col-span-4 custom1:block custom:col-span-4 custom:block">
          <RightSidebar />
        </div>
      </div>
    </>
  );
}
