import React from "react";
import Button from "@/atom/Button";
import Game from "@/organism/Game";

const Main = () => {

  const accessToken = window.localStorage.getItem("access_token");
  const refreshToken = window.localStorage.getItem("refresh_token");

  const REQUEST_URL = "http://146.56.153.237:80";

  const requestUserInfo = async () => {
    const response = await fetch(`${REQUEST_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      const error = await response.text();
      console.log(error);
    }
  }

  const deleteUser = async () => {
    const response: Response = await fetch(
      `${REQUEST_URL}/user`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        }
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      const error = await response.text();
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Main</h1>
    <div>
      <button className="bg-sky-600 hover:bg-sky-700 active:bg-sky-800 m-5" onClick={deleteUser}>
        Delete User
      </button>
    </div>
    <div>
      <button className={`bg-sky-600 hover:bg-sky-700 active:bg-sky-800 m-5`} onClick={requestUserInfo}>
        Request User Info
      </button>
    </div>
      <div>
        <Game/>
      </div>
    </div>
  );
}

export default Main;