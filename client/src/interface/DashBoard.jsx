import React, { useState } from "react";
import Button from "../partials/Button";
import Modal from "../partials/Modal";
import Login from "../components/Login";
import Signup from "../components/Signup";
import ForgotPassword from "../components/ForgotPassword";
const DashBoard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalChild, setModalChild] = useState("");
  return (
    <div className="h-screen lg:p-20 md:p-15 p-5 bg-[#C027D9]">
      <div className="rounded-2xl h-full flex md:flex-row flex-col-reverse md:gap-5 bg-white shadow-lg overflow-clip md:py-0 py-4">
        <div className="flex flex-col md:flex-1 flex-2 md:text-left text-center  justify-center md:space-y-6 space-y-4 md:px-8 px-4">
          <div className="flex flex-col justify-center md:items-start items-center">
            <p className="text-gray-900 md:text-3xl text-lg font-extrabold">
              Welcome to
            </p>
            <div className="border-2 border-[#F709CB] md:w-17 w-10 mx-1 mb-3 rounded-full"></div>
            <h2 className="text-[#02ABF4] md:text-4xl text-3xl lg:text-5xl  font-extrabold ">
              The Talking
            </h2>
          </div>
          <p className="text-gray-900 text-md md:texl-xl">
            Smart, fast, and secure messaging designed for seamless real-time
            communication
          </p>
          <div className="flex flex-col sm:flex-row md:gap-6  gap-4 items-center justify-center md:justify-start px-6 md:px-0">
            <Button
              className={"text-white w-full"}
              onClick={() => {
                setModalOpen(true);
                setModalChild("signup");
              }}
            >
              Sign up
            </Button>
            <Button
              className={
                "text-white bg-[#C027D9]! from-transparent! to-transparent!  w-full"
              }
              onClick={() => {
                setModalOpen(true);
                setModalChild("login");
              }}
            >
              Login
            </Button>
          </div>
        </div>
        <div className="flex-1  flex justify-center items-center">
          <img
            src="https://res.cloudinary.com/dq3njqvjt/image/upload/v1767277192/chatty_users/bfddzdrismty4k1n5we4.png"
            alt="logo"
            className="lg:size-100 md:size-80 size-40"
          />
        </div>
      </div>
      {modalOpen && (
        <Modal
          onClose={() => {
            setModalOpen(false);
            setModalChild("");
          }}
        >
          {modalChild === "signup" && (
            <Signup setModalChild={setModalChild}></Signup>
          )}
          {modalChild === "login" && (
            <Login
              setModalChild={setModalChild}
              setModalOpen={setModalOpen}
            ></Login>
          )}
          {modalChild === "forgotPassword" && (
            <ForgotPassword
              setModalChild={setModalChild}
              setModalOpen={setModalOpen}
            ></ForgotPassword>
          )}
        </Modal>
      )}
    </div>
  );
};

export default DashBoard;
