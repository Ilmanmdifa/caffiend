import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import {
  calculateCurrentCaffeineLevel,
  getCaffeineAmount,
  timeSinceConsumption,
} from "../utils";

export default function History() {
  const { globalData, setGlobalData, globalUser } = useAuth();
  const [deleteError, setDeleteError] = useState(null);

  async function handleDelete(utcTime) {
    if (!window.confirm("Delete this entry?")) {
      return;
    }
    setDeleteError(null);
    //optimistic update with rollback on failure (same honesty rule as submit)
    const previousData = globalData;
    const nextData = { ...previousData };
    delete nextData[utcTime];
    setGlobalData(nextData);
    try {
      await updateDoc(doc(db, "users", globalUser.uid), {
        [utcTime]: deleteField(),
      });
    } catch {
      setGlobalData(previousData);
      setDeleteError("Couldn't delete. Check your connection and try again.");
    }
  }
  return (
    <>
      <div className="section-header">
        <i className="fa-solid fa-timeline" />
        <h2>History</h2>
      </div>
      <p>
        <i>Hover for more information!</i>
      </p>
      <div className="coffee-history">
        {Object.keys(globalData).length === 0 && (
          <p>No entries yet — log your first coffee above.</p>
        )}
        {Object.keys(globalData)
          .sort((a, b) => b - a)
          .map((utcTime, coffeeIndex) => {
            const coffee = globalData[utcTime];
            const timeSinceConsume = timeSinceConsumption(utcTime);
            const originalAmount = getCaffeineAmount(coffee.name);
            const remainingAmount = calculateCurrentCaffeineLevel({
              [utcTime]: coffee,
            });

            const summary = `${coffee.name} | ${timeSinceConsume} | $${coffee.cost} | ${remainingAmount}mg / ${originalAmount}mg`;

            return (
              <div title={summary} key={coffeeIndex}>
                <i className="fa-solid fa-mug-hot"></i>
                <button
                  onClick={() => handleDelete(utcTime)}
                  aria-label={`Delete ${coffee.name}`}
                  title="Delete entry"
                >
                  ✕
                </button>
              </div>
            );
          })}
      </div>
      {deleteError && <p>❌ {deleteError}</p>}
    </>
  );
}
