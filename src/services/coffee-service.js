import { deleteField, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

// Single entry point for Firestore writes on the user document.
// Components call these helpers instead of importing Firestore directly,
// so the storage layer can change in one place.

// Persist one coffee entry. The UTC timestamp is the field name; merge:true
// adds the field while keeping the rest of the document intact.
export async function saveCoffeeEntry(userId, timestamp, { name, cost }) {
  const userRef = doc(db, "users", userId);
  return setDoc(
    userRef,
    {
      [timestamp]: { name, cost },
    },
    { merge: true }
  );
}

// Remove one entry field from the user document without resaving the rest.
export async function deleteCoffeeEntry(userId, timestamp) {
  const userRef = doc(db, "users", userId);
  return updateDoc(userRef, {
    [timestamp]: deleteField(),
  });
}
