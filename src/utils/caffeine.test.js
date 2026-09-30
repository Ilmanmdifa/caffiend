import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  calculateCoffeeStats,
  calculateCurrentCaffeineLevel,
  getCaffeineAmount,
  getTopThreeCoffees,
} from "./caffeine.js";
import { timeSinceConsumption } from "./time.js";

// Fixed clock so time math is deterministic (3A pattern: Arrange with frozen time)
const NOW = new Date("2026-01-15T12:00:00Z").getTime();

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getCaffeineAmount", () => {
  it("returns mg for a known coffee", () => {
    expect(getCaffeineAmount("Espresso")).toBe(63);
  });

  it("returns 0 for an unknown coffee", () => {
    expect(getCaffeineAmount("Unicorn Latte")).toBe(0);
  });
});

describe("calculateCurrentCaffeineLevel (5h half-life)", () => {
  it("counts a fresh entry at full strength", () => {
    expect(calculateCurrentCaffeineLevel({ [NOW]: { name: "Espresso" } })).toBe(
      "63.00"
    );
  });

  it("halves an entry from exactly one half-life ago", () => {
    const fiveHoursAgo = NOW - 5 * 60 * 60 * 1000;
    expect(
      calculateCurrentCaffeineLevel({ [fiveHoursAgo]: { name: "Espresso" } })
    ).toBe("31.50");
  });

  it("ignores entries older than 48h", () => {
    const old = NOW - 49 * 60 * 60 * 1000;
    expect(
      calculateCurrentCaffeineLevel({ [old]: { name: "Espresso" } })
    ).toBe("0.00");
  });
});

describe("getTopThreeCoffees", () => {
  it("ranks by count with percentages and caps at 3", () => {
    const history = {
      1: { name: "Latte" },
      2: { name: "Espresso" },
      3: { name: "Latte" },
      4: { name: "Mocha" },
      5: { name: "Latte" },
      6: { name: "Decaf Coffee" },
    };
    const top = getTopThreeCoffees(history);
    expect(top).toHaveLength(3);
    expect(top[0]).toEqual({
      coffeeName: "Latte",
      count: 3,
      percentage: "50.00%",
    });
  });
});

describe("timeSinceConsumption", () => {
  it("shows 0S right now", () => {
    expect(timeSinceConsumption(NOW)).toBe("0S");
  });

  it("composes minutes and seconds", () => {
    expect(timeSinceConsumption(NOW - 90 * 1000)).toBe("1M 30S");
  });

  it("shows whole hours and days", () => {
    expect(timeSinceConsumption(NOW - 2 * 60 * 60 * 1000)).toBe("2H");
    expect(timeSinceConsumption(NOW - 3 * 24 * 60 * 60 * 1000)).toBe("3D");
  });
});

describe("calculateCoffeeStats", () => {
  it("totals cost and averages per day", () => {
    const history = {
      [NOW]: { name: "Espresso", cost: 3.5 },
      [NOW - 1000]: { name: "Latte", cost: 4.5 },
    };
    const stats = calculateCoffeeStats(history);
    expect(stats.total_cost).toBe("8.00");
    expect(stats.average_coffees).toBe("2.00");
  });

  it("returns zeros (not NaN) for empty history", () => {
    const stats = calculateCoffeeStats({});
    expect(stats.total_cost).toBe("0.00");
    expect(stats.average_coffees).toBe(0);
  });
});
