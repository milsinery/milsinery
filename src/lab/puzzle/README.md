# Баланс

Hidden page: `/#/balance`. The old address `/#/lab/puzzle` redirects here. It is not in the site navigation. While the page is mounted it sets `<meta name="robots" content="noindex">` and `viewport-fit=cover`, and removes both on the way out.

This is the first playable test of the turn-based grid game. All on-screen text is Russian. There is no win or loss from the balance bar yet.

## Where to edit

- `core/config.ts` — every tuned number (costs, stocks, chances, season length, day/night length, game lengths). The values are starting placeholders.
- `core/content.ts` — every popup and label. `describe(state, target)` builds the text for a cell, object, tray card, season, sun, moon, rain, fire, or indicator.

`core/` does not import React or the DOM. It is the part to port to Swift: structs for cells and resources, enums for terrain, items, tools, seasons, and events. `view/` is the SpriteKit stand-in (SVG board, cell size from the free space, portrait tray under the board, landscape panel beside it). `audio/` plays oscillators for place, tool, reject, fire, death, and season change. Core never imports audio.

## Rules

The board is 6×6. Cells are earth (Земля), forest (Лес), or water (Вода). A fresh board is random and always contains all three. Forests start with a wood stock and a food stock. The player begins with 4 wood, 4 food, 4 water, and one house holding 2 residents.

A tap anywhere opens an info popup. A drag from the tray onto a cell is the action. One action is one turn. An illegal drop plays the reject sound and does not spend the turn.

Tray cards are always shown. Only the wood cost can stop an item. Tools are free and only work on an empty, unburnt cell.

- Дом — 2 wood, earth, +2 residents.
- Лесопилка — 1 wood, forest. +1 wood per turn and drains that cell’s wood stock. At 0 the forest becomes earth and the building goes away.
- Дом охотника — 1 wood, forest. +1 food per turn and drains the food stock. The forest stays.
- Лодка рыбака — 1 wood, water. +2 food per turn.
- Поле — 1 wood, earth. +1 food per turn if orthogonally next to water, and 0 in winter. Rain adds +1 even in winter.
- Копать — empty earth becomes water.
- Засыпать — empty water becomes earth.
- Вырубить — empty forest becomes earth and gives +2 wood.

Each water cell orthogonally next to at least one house gives +1 water per turn. Water also adds a small regrowth bonus to adjacent forests.

Each resident eats 1 food and 1 water per turn. If either is short, a hunger counter goes up. After 3 consecutive short turns one resident dies and the counter resets. No residents left is the loss screen (Проигрыш). Food above 3 per resident spoils by 1 per turn.

Time is two clocks:

- Day/night: the sun walks columns 1–6, then the moon walks columns 1–6 (12 turns). The moon does nothing yet. The sun restores forest stock in its column (not above the max). Spring doubles that restore. Winter skips it. In summer the sun can set a field in its column on fire.
- Seasons: Весна, Лето, Осень, Зима, 15 turns each. They do not wait for the day/night cycle. Autumn makes rain more likely. A year is 60 turns.

Rain is one 2×2 cloud. It lasts 2–4 turns and drifts. Fields under it gain food. An earth cell (empty or a field) next to both the cloud and water can flood into water. Rain puts fires out.

Fire spreads to orthogonal forests and fields. After 2 turns the burnt cell becomes earth and loses its building.

Balance is a placeholder from −10 to +10. Surplus food and water push it up, a shortage pushes it down. More buildings than forest-plus-water pushes it up; more nature pushes it down. Nothing is won or lost from it yet.

The length buttons are 60, 120, and 500 turns. Changing the length or pressing Сначала starts a new board. When the turns run out, a summary is shown.

## Turn order

After a legal drop the core, in `rules.ts`:

1. Applies the card.
2. On a day turn, restores forests in the sun column and may light a summer field.
3. Maybe spawns rain, puts out fires under the cloud, feeds fields under it, and may flood.
4. Runs production and drains forest stock.
5. Feeds residents, counts hunger, maybe kills one, then spoils extra food.
6. Spreads older fires and ages them. A flame that has just started is not aged on that same resolve.
7. Drifts the cloud.
8. Moves the balance bar and advances the turn clock.

Row 0 is the top of the board. In SpriteKit, `y = (rows - 1 - row) * cellSize`.
