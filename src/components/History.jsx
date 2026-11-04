import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteCoffeeEntry } from "../services/coffee-service.js";
import Modal from "./Modal.jsx";
import {
  calculateCurrentCaffeineLevel,
  getCaffeineAmount,
  timeSinceConsumption,
} from "../utils";

export default function History() {
  const { globalData, setGlobalData, globalUser } = useAuth();
  const [deleteError, setDeleteError] = useState(null);
  // Entry timestamp awaiting the confirmation dialog, or null when no
  // confirmation is open. Replaces the browser-blocking window.confirm.
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Remaining caffeine per entry, computed once per data change.
  // Each helper call receives a single-entry object, so this stays O(n).
  const remainingAmounts = useMemo(() => {
    return Object.fromEntries(
      Object.entries(globalData || {}).map(([utcTime, coffee]) => [
        utcTime,
        calculateCurrentCaffeineLevel({ [utcTime]: coffee }),
      ])
    );
  }, [globalData]);

  function handleRequestDelete(utcTime) {
    setDeleteError(null);
    setPendingDelete(utcTime);
  }

  async function handleDelete(utcTime) {
    if (!utcTime || isDeleting) {
      return;
    }
    //optimistic update with rollback on failure (same honesty rule as submit)
    const previousData = globalData;
    const nextData = { ...previousData };
    delete nextData[utcTime];
    setGlobalData(nextData);
    setIsDeleting(true);
    try {
      await deleteCoffeeEntry(globalUser.uid, utcTime);
      setPendingDelete(null);
    } catch {
      setGlobalData(previousData);
      setDeleteError("Couldn't delete. Check your connection and try again.");
    } finally {
      setIsDeleting(false);
    }
  }
  return (
    <>
      {pendingDelete !== null && (
        <Modal handleCloseModal={() => setPendingDelete(null)} compact>
          <h2>Delete this entry?</h2>
          <p>
            {globalData[pendingDelete]?.name} |{" "}
            {timeSinceConsumption(Number(pendingDelete))} lebih | $
            {globalData[pendingDelete]?.cost}
          </p>
          <div className="register-container">
            <button
              onClick={() => setPendingDelete(null)}
              disabled={isDeleting}
            >
              <p>Cancel</p>
            </button>
            <button
              onClick={() => handleDelete(pendingDelete)}
              disabled={isDeleting}
              aria-label="Confirm delete"
            >
              <p>{isDeleting ? "Deleting..." : "Delete"}</p>
            </button>
          </div>
        </Modal>
      )}
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
            const remainingAmount = remainingAmounts[utcTime];

            const summary = `${coffee.name} | ${timeSinceConsume} | $${coffee.cost} | ${remainingAmount}mg / ${originalAmount}mg`;

            return (
              <div title={summary} key={coffeeIndex}>
                <i className="fa-solid fa-mug-hot"></i>
                <button
                  onClick={() => handleRequestDelete(utcTime)}
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
