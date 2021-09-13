import React, { useContext, createContext, useState } from "react";

import { useHistory, useLocation } from "react-router-dom";

function Login() {
  let history = useHistory();
  let location = useLocation();

  return (
    <div>
      <p>You must log in to view the page at</p>
      
    </div>
  );
}

export default Login;
