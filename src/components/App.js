import React from "react";
import { useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  console.log(authService.currentUser);
  setTimeout(() => {
    console.log(authService.currentUser);
  }, 2000);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter </footer>
    </>
  );
}

export default App;
