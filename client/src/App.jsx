import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./provider/AuthProvider";
import DashBoard from "./interface/DashBoard";
import { ScaleLoader } from "react-spinners";
import { Loader } from "./partials/Loader";
function App() {
  const { isLoggedIn, serverError, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <Loader>
        <ScaleLoader size={20} color="#F709CB"></ScaleLoader>
      </Loader>
    );
  }
  if (serverError) {
    return (
      <Loader>
        <h2 className="text-[#F709CB] font-md text-2xl">{serverError}</h2>
      </Loader>
    );
  } else {
    return <>{isLoggedIn ? <Outlet /> : <DashBoard></DashBoard>}</>;
  }
}

export default App;
