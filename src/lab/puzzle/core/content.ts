import { CONFIG } from "./config";
import { celestialOf, seasonOf } from "./time";
import {
  CardId,
  CellData,
  GameState,
  InfoTarget,
  ItemKind,
  SeasonName,
  TopicId,
} from "./types";
import { cellIndex } from "./board";

export interface Description {
  title: string;
  lines: string[];
}

export const TEXT = {
  title: "Баланс",
  wood: "Дерево",
  food: "Пища",
  water: "Вода",
  residents: "Жители",
  balance: "Баланс",
  tray: "Запас",
  restart: "Сначала",
  again: "Заново",
  mute: "Тише",
  unmute: "Звук",
  lossTitle: "Проигрыш",
  endTitle: "Срок вышел",
  turn: "Ход",
  day: "День",
  night: "Ночь",
  close: "Закрыть",
  /** Left end of the bar: what pulls the value down. */
  balanceLeft: "Нехватка и природа",
  /** Right end of the bar: what pulls the value up. */
  balanceRight: "Излишек и постройки",
};

export const RESOURCE_ICON = {
  wood: "🪵",
  food: "🌾",
  water: "💧",
  residents: "👥",
};

export const SEASON_LABEL: { [key in SeasonName]: string } = {
  spring: "Весна",
  summer: "Лето",
  autumn: "Осень",
  winter: "Зима",
};

export const CARD_LABEL: { [key in CardId]: string } = {
  house: "Дом",
  sawmill: "Лесопилка",
  hunter: "Охотник",
  boat: "Лодка",
  field: "Поле",
  dig: "Копать",
  fill: "Засыпать",
  chop: "Вырубить",
};

export const CARD_ICON: { [key in CardId]: string } = {
  house: "🏠",
  sawmill: "🪵",
  hunter: "🏹",
  boat: "🚤",
  field: "🌱",
  dig: "⛏️",
  fill: "🪨",
  chop: "🪓",
};

export function describe(state: GameState, target: InfoTarget): Description {
  if (target.kind === "card") {
    return describeCard(target.card);
  }
  if (target.kind === "topic") {
    return describeTopic(state, target.topic);
  }
  if (target.kind === "item") {
    return describeItem(state, target.cell.column, target.cell.row, target.item);
  }
  return describeCell(state, target.cell.column, target.cell.row);
}

export function endLines(state: GameState): string[] {
  const sky = celestialOf(state.turn);
  const phase = sky.phase === "day" ? TEXT.day : TEXT.night;
  return [
    "Ходов сыграно: " + state.turn + " из " + state.length + ".",
    "Сезон: " + SEASON_LABEL[seasonOf(state.turn)] + ", " + phase + ".",
    TEXT.wood + ": " + state.resources.wood + ".",
    TEXT.food + ": " + state.resources.food + ".",
    TEXT.water + ": " + state.resources.water + ".",
    TEXT.residents + ": " + state.resources.residents + ".",
    TEXT.balance + ": " + state.resources.balance + ".",
  ];
}

function describeCell(state: GameState, column: number, row: number): Description {
  const data = state.cells[cellIndex(column, row)];
  const lines = terrainLines(data);
  pushFire(lines, data);
  pushRain(lines, state, column, row);
  lines.push("Столбец " + (column + 1) + ", ряд " + (row + 1) + ".");
  return { title: terrainTitle(data), lines: lines };
}

function describeItem(
  state: GameState,
  column: number,
  row: number,
  item: ItemKind
): Description {
  const data = state.cells[cellIndex(column, row)];
  const card = describeCard(item);
  const lines = card.lines.slice();
  lines.push("Стоит на клетке «" + terrainTitle(data) + "».");
  if (data.terrain === "forest") {
    lines.push(
      "Запас леса: дерево " + data.forestWood + ", пища " + data.forestFood + "."
    );
  }
  pushFire(lines, data);
  pushRain(lines, state, column, row);
  return { title: card.title, lines: lines };
}

function describeCard(card: CardId): Description {
  if (card === "house") {
    return {
      title: "Дом",
      lines: [
        "Стоит " + CONFIG.costHouse + " дерева. Ставится на землю.",
        "Даёт " + CONFIG.houseResidents + " жителей.",
      ],
    };
  }
  if (card === "sawmill") {
    return {
      title: "Лесопилка",
      lines: [
        "Стоит " + CONFIG.costSawmill + " дерево. Ставится на лес.",
        "+" + CONFIG.sawmillWood + " дерево за ход и тратит запас дерева этой клетки.",
        "Когда запас кончается, лес становится землёй, постройка исчезает.",
      ],
    };
  }
  if (card === "hunter") {
    return {
      title: "Дом охотника",
      lines: [
        "Стоит " + CONFIG.costHunter + " дерево. Ставится на лес.",
        "+" + CONFIG.hunterFood + " пища за ход и тратит запас пищи этой клетки.",
      ],
    };
  }
  if (card === "boat") {
    return {
      title: "Лодка рыбака",
      lines: [
        "Стоит " + CONFIG.costBoat + " дерево. Ставится на воду.",
        "+" + CONFIG.boatFood + " пищи за ход.",
      ],
    };
  }
  if (card === "field") {
    return {
      title: "Поле",
      lines: [
        "Стоит " + CONFIG.costField + " дерево. Ставится на землю.",
        "+" +
          CONFIG.fieldFood +
          " пища за ход, если рядом по стороне есть вода. Зимой не кормит.",
        "Под дождём даёт ещё +" + CONFIG.rainFieldFood + ".",
      ],
    };
  }
  if (card === "dig") {
    return {
      title: "Копать",
      lines: ["Бесплатно. Пустая земля становится водой."],
    };
  }
  if (card === "fill") {
    return {
      title: "Засыпать",
      lines: ["Бесплатно. Пустая вода становится землёй."],
    };
  }
  return {
    title: "Вырубить",
    lines: [
      "Бесплатно. Пустой лес становится землёй.",
      "Вы получаете " + CONFIG.chopWood + " дерева.",
    ],
  };
}

function describeTopic(state: GameState, topic: TopicId): Description {
  if (topic === "wood") {
    return {
      title: TEXT.wood,
      lines: [
        "Сейчас: " + state.resources.wood + ".",
        "Стройматериал. Дома и мастерские тратят его.",
        "Лесопилка и вырубка приносят дерево.",
      ],
    };
  }
  if (topic === "food") {
    return {
      title: TEXT.food,
      lines: [
        "Сейчас: " + state.resources.food + ".",
        "Каждый житель съедает " + CONFIG.foodPerResident + " за ход.",
        "Запас свыше " +
          CONFIG.foodCapPerResident +
          " на человека портится: −" +
          CONFIG.spoilagePerTurn +
          " за ход.",
      ],
    };
  }
  if (topic === "water") {
    return {
      title: TEXT.water,
      lines: [
        "Сейчас: " + state.resources.water + ".",
        "Каждый житель выпивает " + CONFIG.waterPerResident + " за ход.",
        "Клетка воды рядом с домом даёт +" + CONFIG.waterPerHouse + " за ход.",
      ],
    };
  }
  if (topic === "residents") {
    return {
      title: TEXT.residents,
      lines: [
        "Сейчас: " + state.resources.residents + ".",
        "Новый дом селит " + CONFIG.houseResidents + " жителей.",
        "Если " +
          CONFIG.hungerTurns +
          " хода подряд не хватает пищи или воды, один житель умирает.",
        "Если не останется никого — проигрыш.",
      ],
    };
  }
  if (topic === "balance") {
    return {
      title: TEXT.balance,
      lines: [
        "Сейчас: " + state.resources.balance + " (лучше всего 0).",
        "Шкала от " + CONFIG.balanceMin + " до " + CONFIG.balanceMax + ".",
        "Излишек пищи и воды тянет вверх, нехватка — вниз.",
        "Много построек относительно леса и воды тянет вверх, нетронутая природа — вниз.",
        "Пока от баланса не зависит победа. Это черновик.",
      ],
    };
  }
  if (topic === "season") {
    return describeSeason(seasonOf(state.turn));
  }
  if (topic === "sun") {
    return {
      title: "Солнце",
      lines: [
        "Идёт слева направо по всем " + CONFIG.dayColumns + " столбцам.",
        "В своём столбце лес восстанавливает запас дерева и пищи.",
        "Весной восстановление сильнее, зимой его нет. Рядом с водой лес растёт быстрее.",
        "Летом солнце может поджечь поле в своём столбце.",
      ],
    };
  }
  if (topic === "moon") {
    return {
      title: "Луна",
      lines: [
        "Идёт слева направо по всем " + CONFIG.nightColumns + " столбцам после дня.",
        "Пока ни на что не влияет.",
      ],
    };
  }
  if (topic === "rain") {
    return {
      title: "Дождь",
      lines: [
        "Туча " + CONFIG.cloudSize + "×" + CONFIG.cloudSize + ".",
        "Держится " +
          CONFIG.rainDurationMin +
          "–" +
          CONFIG.rainDurationMax +
          " хода и сдвигается.",
        "Поле под ней даёт ещё +" + CONFIG.rainFieldFood + " пищи.",
        "Может залить соседнюю землю у воды. Тушит огонь.",
        "Осенью дождь чаще.",
      ],
    };
  }
  if (topic === "fire") {
    return {
      title: "Огонь",
      lines: [
        "Перекидывается на соседние лес и поля.",
        "Через " + CONFIG.fireBurnTurns + " хода клетка сгорает до земли, постройка пропадает.",
        "Дождь тушит огонь.",
      ],
    };
  }
  const sky = celestialOf(state.turn);
  const phase = sky.phase === "day" ? TEXT.day : TEXT.night;
  return {
    title: "Время",
    lines: [
      "Ход " + (state.turn + 1) + " из " + state.length + ".",
      "Сейчас " + phase.toLowerCase() + ", столбец " + (sky.column + 1) + ".",
      "День и ночь — это " +
        CONFIG.dayColumns +
        " + " +
        CONFIG.nightColumns +
        " ходов, отдельно от сезонов.",
      "Сезон длится " + CONFIG.seasonTurns + " ходов. Год — " + CONFIG.seasonTurns * 4 + ".",
    ],
  };
}

function describeSeason(season: SeasonName): Description {
  const lengthLine = "Сезон длится " + CONFIG.seasonTurns + " ходов.";
  if (season === "spring") {
    return {
      title: "Весна",
      lines: [
        lengthLine,
        "Лес под солнцем восстанавливает запас вдвое быстрее.",
      ],
    };
  }
  if (season === "summer") {
    return {
      title: "Лето",
      lines: [lengthLine, "Солнце может поджечь поле в своём столбце."],
    };
  }
  if (season === "autumn") {
    return {
      title: "Осень",
      lines: [lengthLine, "Дождь идёт чаще."],
    };
  }
  return {
    title: "Зима",
    lines: [lengthLine, "Лес не восстанавливается. Поля не кормят."],
  };
}

function terrainTitle(data: CellData): string {
  if (data.terrain === "forest") {
    return "Лес";
  }
  if (data.terrain === "water") {
    return "Вода";
  }
  return "Земля";
}

function terrainLines(data: CellData): string[] {
  if (data.terrain === "earth") {
    return [
      "Можно поставить дом или поле.",
      "Копать превращает пустую землю в воду.",
    ];
  }
  if (data.terrain === "forest") {
    return [
      "Запас дерева: " + data.forestWood + ", пищи: " + data.forestFood + ".",
      "Сюда ставятся лесопилка и дом охотника.",
      "Солнце восстанавливает запас. Зимой лес не растёт. Рядом с водой растёт быстрее.",
      "Вырубить пустой лес даёт " + CONFIG.chopWood + " дерева.",
    ];
  }
  return [
    "Сюда ставится лодка рыбака.",
    "Если рядом дом, клетка даёт +" + CONFIG.waterPerHouse + " воды за ход.",
    "Кормит соседние поля и помогает лесу расти.",
    "Засыпать превращает пустую воду в землю.",
  ];
}

function pushFire(lines: string[], data: CellData): void {
  if (data.fireAge > 0) {
    lines.push(
      "Клетка горит. Через " +
        CONFIG.fireBurnTurns +
        " хода станет землёй, если дождь не потушит огонь."
    );
  }
}

function pushRain(lines: string[], state: GameState, column: number, row: number): void {
  const cloud = state.cloud;
  if (cloud === null) {
    return;
  }
  if (
    column >= cloud.column &&
    row >= cloud.row &&
    column < cloud.column + CONFIG.cloudSize &&
    row < cloud.row + CONFIG.cloudSize
  ) {
    lines.push("Клетку накрывает дождь.");
  }
}
