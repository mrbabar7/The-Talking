const About = () => {
  return (
    <div className="h-full md:flex hidden flex-col py-6   relative items-center">
      <div className="rounded-full lg:size-50 md:size-35 size-28 relative">
        <img
          src="https://res.cloudinary.com/dq3njqvjt/image/upload/v1765799897/chatty_users/o9fsvbqry8cmb2dntta9.jpg"
          alt="img"
          className="rounded-full size-full p-1 overflow-hidden object-cover border-2 border-[#F709CB]"
        />
      </div>
      <p className="text-md font-semibold text-app mt-4 text-center">
        Muhammad Abu-Bakar Khan Babar
      </p>
      <h2 className="text-indigo-900 font-semibold text-lg mt-1 ">
        CEO of
        <span className="text-[#F709CB] border-b-2 "> MR.BABAR </span>
      </h2>
      <div className="w-full flex flex-col md:space-y-5 space-y-4 justify-start items-start mt-4  bg-indigo-900 shadow-lg p-4">
        <span className="text-white font-md text-sm mb-1">Email</span>
        <p className="text-[#F709CB] font-md text-sm">mrbabar985@gmail.com</p>
        <span className="text-white font-md text-sm mb-1">Contact</span>
        <p className="text-[#F709CB] font-md text-sm">+92 307-6840971</p>
        <span className="text-white font-md text-sm mb-1">Address</span>
        <p className="text-[#F709CB] font-md text-sm">Okara, Punjab Pakistan</p>
        <div className="flex gap-5 items-center w-full">
          <a
            href="https://mrbabarportfolio.netlify.app"
            className="text-white font-md text-sm mb-1"
          >
            Visit Portfolio
          </a>
          <a
            href="https://github.com/mrbabar7"
            className="text-white font-md text-sm mb-1"
          >
            Visit GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
export default About;
