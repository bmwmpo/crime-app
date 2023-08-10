import {
  updateDoc,
  onSnapshot,
  collection,
  doc,
  query,
  where,
} from "firebase/firestore";
import EnumString from "../assets/EnumString";
import { db } from "../config/firebase_config";

//get the vote count suffix
const getCountSuffix = (countNum) => {
  if (countNum < 1000) return `${countNum}`;
  if (countNum >= 1000 && countNum < 1000000)
    return `${(countNum / 1000).toFixed(1)}k`;
  if (countNum >= 1000000) return `${(countNum / 1000000).toFixed(1)}m`;
};

//get post time passing
const getTimePassing = (dateTime) => {
  const timePassingInHrs = (new Date() - dateTime) / 1000 / 60 / 60;

  if (timePassingInHrs > 24) {
    return `${Math.floor(timePassingInHrs / 24)}d`;
  } else if (timePassingInHrs < 1) {
    const timePassingInMin = timePassingInHrs * 60;
    return timePassingInMin > 1 ? `${Math.ceil(timePassingInMin)}m` : "now";
  } else {
    return `${Math.ceil(timePassingInHrs)}h`;
  }
};

//increase or decrease the vote count
const updateVoteCount = async (voteStatus, upVoteCount, docRef) => {
  try {
    !voteStatus
      ? await updateDoc(docRef, { upVote: upVoteCount + 1 })
      : await updateDoc(docRef, { upVote: upVoteCount - 1 });
  } catch (err) {
    console.log(err);
  }
};

//Check whether the user has voted or not
const getVoteState = (votersList, setVoteStatus, userId) => {
  const voteAlready = votersList.filter((item) => item === userId);

  //update the vote status
  voteAlready.length > 0 ? setVoteStatus(true) : setVoteStatus(false);
};

//update the upVote count
const updateVoters = async (
  voteStatus,
  setVoteStatus,
  votersList,
  docRef,
  userId
) => {
  try {
    //if the vote state is false, add the current user id in the voters list in firestore
    if (!voteStatus) {
      await updateDoc(docRef, {
        voters: [...votersList, userId],
      });
      setVoteStatus(true);
    }
    //else remove the user if from the voters list in firestore
    else {
      const voters = votersList.filter((item) => item !== userId);
      await updateDoc(docRef, { voters });
      setVoteStatus(false);
    }
  } catch (err) {
    console.log(err);
  }
};

//get real time vote count and voter list with firestore
const getRealTimeUpdate = (docRef, setVoterslist, setUpVoteCount) => {
  onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      setVoterslist(doc.data().voters);
      setUpVoteCount(doc.data().upVote);
    }
  });
};

export {
  getCountSuffix,
  getTimePassing,
  updateVoteCount,
  getVoteState,
  updateVoters,
  getRealTimeUpdate,
};
