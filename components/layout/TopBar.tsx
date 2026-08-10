export default function TopBar() {
  return (
    <div className="bg-[#003f36] text-white">
      <div className="container flex min-h-9 items-center justify-between gap-4 text-[11px]">
        <div className="flex items-center gap-4">
          <a href="tel:+254727971171" className="hover:text-[#ffc400]">
            Call: +254 727 971 171
          </a>

          <a
            href="mailto:ecovoltsolar145@gmail.com"
            className="hidden hover:text-[#ffc400] md:inline"
          >
            ecovoltsolar145@gmail.com
          </a>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <a href="/about" className="hover:text-[#ffc400]">
            About Us
          </a>

          <a href="/projects" className="hover:text-[#ffc400]">
            Projects
          </a>

          <a href="/track-order" className="hover:text-[#ffc400]">
            Track Order
          </a>

          <a href="/contact" className="hover:text-[#ffc400]">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}