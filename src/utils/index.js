// Barrel: keeps existing `from "../utils"` imports working.
// Data lives in ../data/coffee-data.js, logic in ./caffeine.js and ./time.js.
export {
  statusLevels,
  coffeeConsumptionHistory,
  coffeeOptions,
} from "../data/coffee-data.js";
export {
  calculateCurrentCaffeineLevel,
  getCaffeineAmount,
  getTopThreeCoffees,
  calculateCoffeeStats,
} from "./caffeine.js";
export { timeSinceConsumption } from "./time.js";
