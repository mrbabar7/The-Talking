export const Loader = ({ className, children }) => {
  return (
    <div className="h-screen inset-0 flex justify-center items-center bg-blue-100 ">
      {children}
    </div>
  );
};

export const UpdateLoader = ({ className, children }) => {
  return (
    <div
      className={`absolute z-50 inset-0 flex justify-center items-center bg-black/10 ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};
