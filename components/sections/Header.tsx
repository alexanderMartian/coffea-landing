import HeaderNav from "./HeaderNav";

export default function Header() {
  return (
    <header
      id="header"
      className="absolute inset-x-0 z-50 top-4 md:top-6 3xl:top-[3.4375rem]"
    >
      <HeaderNav />
    </header>
  );
}
