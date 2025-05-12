import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/custom/Header";

const MainLayout = () => {
  return (
    <Fragment>
      {/* The Navbar will always be displayed */}
      <Header />
      <Outlet />
    </Fragment>
  );
};

export default MainLayout;
