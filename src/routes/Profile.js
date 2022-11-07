import React, { useEffect } from "react";
import { authService, dbService } from "../fbase";
import { useNavigate } from "react-router-dom";
import { doc } from "firebase/firestore";

export default ({ userObj }) => {
  const history = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyNweets = async () => {
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .get();
    console.log(nweets.docs.map((doc) => doc.data()));
  };
  useEffect(() => {
    getMyNweets();
  }, []);
  return (
    <>
      <form>
        <input type="text" placeholder="Display name" />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log out</button>
    </>
  );
};
