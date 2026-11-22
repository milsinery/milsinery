/**
 * Every tuned number for «Баланс» lives here.
 * The values are starting placeholders — change them freely.
 * Day/night (6 + 6 turns) and seasons (15 turns) are separate clocks.
 */
export const CONFIG = {
  boardSize: 6,

  /** Turns in one season. Four seasons = 60 turns = one year. */
  seasonTurns: 15,

  /** Sun walks every column, then the moon walks every column. */
  dayColumns: 6,
  nightColumns: 6,

  /** Shortest game is one year. */
  gameLengths: [60, 120, 500],

  startWood: 4,
  startFood: 4,
  startWater: 4,
  startResidents: 2,

  forestWoodStock: 6,
  forestFoodStock: 6,

  costHouse: 2,
  costSawmill: 1,
  costHunter: 1,
  costBoat: 1,
  costField: 1,

  houseResidents: 2,
  sawmillWood: 1,
  hunterFood: 1,
  boatFood: 2,
  fieldFood: 1,
  rainFieldFood: 1,
  waterPerHouse: 1,
  chopWood: 2,

  foodPerResident: 1,
  waterPerResident: 1,

  /** Consecutive turns short of food or water before one resident dies. */
  hungerTurns: 3,

  /** Food above this many per resident spoils. Placeholder for disease. */
  foodCapPerResident: 3,
  spoilagePerTurn: 1,

  /** Sun column: forest stock restored, before the spring multiplier. */
  sunForestRestore: 1,
  /** Extra stock when the forest is orthogonally next to water. */
  waterForestBonus: 1,
  springRegrowthMultiplier: 2,

  summerFireChance: 0.2,
  fireSpreadChance: 0.45,
  /** A flame lasts this many resolves, then the cell becomes earth. */
  fireBurnTurns: 2,

  rainChance: 0.18,
  rainChanceAutumn: 0.42,
  rainDurationMin: 2,
  rainDurationMax: 4,
  cloudSize: 2,
  floodChance: 0.25,

  balanceMin: -10,
  balanceMax: 10,
  /** Fed with leftovers of both food and water. */
  balanceSurplusStep: 1,
  /** Not enough food or water for every resident. */
  balanceDeficitStep: 1,
  /** More buildings than forest + water cells. Placeholder, pushes up. */
  balanceDevelopmentStep: 1,
  /** More forest + water than buildings. Placeholder, pushes down. */
  balanceNatureStep: 1,
};
