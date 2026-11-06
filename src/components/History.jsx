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
  // Entry timestamp shown in the details dialog, or null when closed.
  const [detailEntry, setDetailEntry] = useState(null);

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

  // Values for the entry-details dialog. detailCoffee is null when the
  // dialog is closed or the entry no longer exists (e.g. deleted from
  // another tab), which unmounts the dialog instead of showing stale data.
  const detailCoffee = detailEntry !== null ? globalData[detailEntry] : null;
  const detailOriginal = detailCoffee ? getCaffeineAmount(detailCoffee.name) : 0;
  const detailRemaining = detailCoffee
    ? Number(remainingAmounts[detailEntry] ?? 0)
    : 0;
  const detailRemainingPercent =
    detailOriginal > 0 && detailCoffee
      ? Math.round((detailRemaining / detailOriginal) * 100)
      : null;

  return (
    <>
      {pendingDelete !== null && (
        <Modal handleCloseModal={() => setPendingDelete(null)} compact>
          <h2>Delete this entry?</h2>
          <p>
            {globalData[pendingDelete]?.name} | consumed{" "}
            {timeSinceConsumption(Number(pendingDelete))} ago | $
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
      {(detailCoffee) && (
        <Modal handleCloseModal={() => setDetailEntry(null)} compact>
          <h2>{detailCoffee.name}</h2>
          <p>
            Consumed {timeSinceConsumption(Number(detailEntry))} ago
          </p>
          <p>{new Date(Number(detailEntry)).toLocaleString()}</p>
          <p>Cost: ${detailCoffee.cost}</p>
          <p>
            {detailOriginal > 0
              ? `Caffeine now: ${remainingAmounts[detailEntry]}mg / ${detailOriginal}mg (${detailRemainingPercent}% left)`
              : "Caffeine: unknown amount for this coffee."}
          </p>
          <button onClick={() => setDetailEntry(null)}>
            <p>Close</p>
          </button>
        </Modal>
      )}
      <div className="section-header">
        <i className="fa-solid fa-timeline" />
        <h2>History</h2>
      </div>
      <p>
        <i>Click a cup icon for details — hover for a quick summary!</i>
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
                <button
                  onClick={() => setDetailEntry(utcTime)}
                  aria-label={`Entry details for ${coffee.name}`}
                  title={"Entry details"}
                >
                  <i className="fa-solid fa-mug-hot"></i>
                </button>
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
