import React, { useEffect, useState } from "react";
import Nweet from "../components/Nweet";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fbase";
import { addDoc, collection, getDocs, onSnapshot } from "firebase/firestore";

const Home = ({ userObj }) => {
  //console.log(userObj);
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState();
  //   const getNweets = async () => {
  //     const dbNweets = await dbService.collection("nweets").get();
  //     dbNweets.forEach((document) => {
  //       const nweetObject = {
  //         ...document.data(),
  //         id: document.id,
  //       };
  //       setNweets((prev) => [nweetObject, ...prev]);
  //     });
  //     //console.log(dbNweets);
  //   };
  useEffect(() => {
    onSnapshot(collection(dbService, "nweets"), (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //console.log(nweetArray);
      setNweets(nweetArray);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "nweets"), nweetObj);
    setNweet("");
    setAttachment("");
    // await addDoc(collection(dbService, "nweets"), {
    //   text: nweet,
    //   createAt: Date.now(),
    //   creatorId: userObj.uid,
    // });
    // setNweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  //console.log(nweets);
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    //console.log(theFile);

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>clear</button>
        </div>
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
