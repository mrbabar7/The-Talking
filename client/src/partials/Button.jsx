const Button = ({ children, onClick, className, disabled, type }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className}  bg-linear-to-r from-[#C027D9] to-[#02ABF4] text-md md:px-6 px-4 md:py-3 py-2 rounded-4xl cursor-pointer transition-all duration-200 ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
