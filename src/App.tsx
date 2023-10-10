import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import API from "./services";
import Books from "./components/Books/Books";

function App() {
  // const getBooks = async () => {
  //   try {
  //     const response: any = await API.post("books", {});

  //     if (response.data.status === "RS_OK") {

  //       } else {

  //       }
  //     } else {
  //     }
  //   } catch (err) {
  //   }
  // };

  // useEffect(() => {
  //   getBooks();
  // }, []);

  return (
    <>
      <Books></Books>{" "}
    </>
  );
}

export default App;
