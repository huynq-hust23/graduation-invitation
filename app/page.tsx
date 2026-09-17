import SkipLink from "@/components/SkipLink";
import LangToggle from "@/components/LangToggle";
import BoardingPass from "@/components/BoardingPass";
import Details from "@/components/Details";
import Route from "@/components/Route";
import Places from "@/components/Places";
import Journey from "@/components/Journey";
import Thanks from "@/components/Thanks";
import Dock from "@/components/Dock";
import SectionPager from "@/components/SectionPager";

export default function Page() {
  return (
    <>
      <SkipLink />
      <LangToggle />

      {/* Các dải sáng/tối tự phân tách nhau, không cần đường kẻ ngăn. */}
      <main id="main">
        <BoardingPass />
        <Details />
        <Route />
        <Places />
        <Journey />
        <Thanks />
      </main>

      <Dock />
      <SectionPager />
    </>
  );
}
