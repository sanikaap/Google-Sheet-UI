

export const Navbar = () => {
  return (
    <header className="text-slate-950 body-font bg-slate-200">
  <div className="container mx-auto bg-slate-200 flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
      <svg xmlns="https://icons8.com/icon/30461/google-sheets" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-10 h-10 text-white p-2 bg-green-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span className="ml-3 text-xl">Google Sheet UI</span>
    </a>
  </div>
</header>
  )
}

export default Navbar;
