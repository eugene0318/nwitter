import React from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const onDeleteClick = () => {
    const ok = confirm("are you sure you wanna to delete this nweet");
  };
  return (
    <div>
      <h4>{nweetObj.text}</h4>
      {isOwner && (
        <>
          <button>Delete Nweet</button>
          <button>Edit Nweet</button>
        </>
      )}{" "}
    </div>
  );
};

export default Nweet;
