import React, { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";

const Auth = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleFormView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div>
      {isLoginView ? (
        <Login onFormSwitch={toggleFormView} />
      ) : (
        <Register onFormSwitch={toggleFormView} />
      )}
    </div>
  );
};

export default Auth;
