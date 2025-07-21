import { useState } from "react";

const ITEM_BAG_DEFAULT = 350;
const ITEM_BAG_MAX = 2500;
const ITEM_BAG_STEP = 50;
const ITEM_BAG_COST_PER_UPGRADE = 200;

const POKEMON_STORAGE_DEFAULT = 300;
const POKEMON_STORAGE_MAX = 3000;
const POKEMON_STORAGE_STEP = 50;
const POKEMON_STORAGE_COST_PER_UPGRADE = 200;

const COIN_BUNDLES = [
  { coins: 110, price: 0.99, label: "110 PokéCoin - $0.99" },
  { coins: 600, price: 4.99, label: "600 PokéCoin - $4.99" },
  { coins: 1300, price: 9.99, label: "1,300 PokéCoin - $9.99" },
  { coins: 2700, price: 19.99, label: "2,700 PokéCoin - $19.99" },
  { coins: 5600, price: 39.99, label: "5,600 PokéCoin - $39.99" },
  { coins: 15500, price: 99.99, label: "15,500 PokéCoin - $99.99" },
];

export default function CostCalculator() {
  // Baseline state
  const [itemBagBaseline, setItemBagBaseline] = useState(ITEM_BAG_DEFAULT);
  const [pokemonStorageBaseline, setPokemonStorageBaseline] = useState(
    POKEMON_STORAGE_DEFAULT
  );

  // Track if baseline has been set by user
  const [itemBagCustomBaseline, setItemBagCustomBaseline] = useState(false);
  const [pokemonStorageCustomBaseline, setPokemonStorageCustomBaseline] =
    useState(false);

  // Slider state (relative to baseline)
  const [itemBagSlider, setItemBagSlider] = useState(0);
  const [pokemonStorageSlider, setPokemonStorageSlider] = useState(0);

  // Coin bundle selection
  const [selectedBundleIdx, setSelectedBundleIdx] = useState(0);
  const selectedBundle = COIN_BUNDLES[selectedBundleIdx];
  const coinsPerDollar = selectedBundle.coins / selectedBundle.price;

  // Max upgrades from current baseline
  const itemBagMaxUpgrades = Math.floor(
    (ITEM_BAG_MAX - itemBagBaseline) / ITEM_BAG_STEP
  );
  const pokemonStorageMaxUpgrades = Math.floor(
    (POKEMON_STORAGE_MAX - pokemonStorageBaseline) / POKEMON_STORAGE_STEP
  );

  // Set baseline using slider
  const handleSetItemBagBaseline = () => {
    setItemBagBaseline(itemBagBaseline + itemBagSlider * ITEM_BAG_STEP);
    setItemBagSlider(0);
    setItemBagCustomBaseline(true);
  };

  const handleSetPokemonStorageBaseline = () => {
    setPokemonStorageBaseline(
      pokemonStorageBaseline + pokemonStorageSlider * POKEMON_STORAGE_STEP
    );
    setPokemonStorageSlider(0);
    setPokemonStorageCustomBaseline(true);
  };

  // Reset baseline to default, and set slider to previous custom baseline
  const handleResetItemBagBaseline = () => {
    const previousCustom = itemBagBaseline;
    setItemBagBaseline(ITEM_BAG_DEFAULT);
    setItemBagSlider((previousCustom - ITEM_BAG_DEFAULT) / ITEM_BAG_STEP);
    setItemBagCustomBaseline(false);
  };

  const handleResetPokemonStorageBaseline = () => {
    const previousCustom = pokemonStorageBaseline;
    setPokemonStorageBaseline(POKEMON_STORAGE_DEFAULT);
    setPokemonStorageSlider(
      (previousCustom - POKEMON_STORAGE_DEFAULT) / POKEMON_STORAGE_STEP
    );
    setPokemonStorageCustomBaseline(false);
  };

  // Calculations
  const itemBagTotalCoins = itemBagSlider * ITEM_BAG_COST_PER_UPGRADE;
  const pokemonStorageTotalCoins =
    pokemonStorageSlider * POKEMON_STORAGE_COST_PER_UPGRADE;
  const totalCoins = itemBagTotalCoins + pokemonStorageTotalCoins;

  // USD calculations based on bundle
  const itemBagTotalUSD = (itemBagTotalCoins / coinsPerDollar).toFixed(2);
  const pokemonStorageTotalUSD = (
    pokemonStorageTotalCoins / coinsPerDollar
  ).toFixed(2);
  const totalUSD = (totalCoins / coinsPerDollar).toFixed(2);

  return (
    <div className="max-w-xl mx-auto my-8 p-8 border border-gray-800 rounded-xl bg-gray-900 shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-300">
        Pokémon Go Cost Calculator
      </h1>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <label className="text-gray-200 font-medium" htmlFor="coin-bundle">
          PokéCoin Bundle:
        </label>
        <select
          id="coin-bundle"
          className="bg-gray-800 text-gray-100 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedBundleIdx}
          onChange={(e) => setSelectedBundleIdx(Number(e.target.value))}
        >
          {COIN_BUNDLES.map((bundle, idx) => (
            <option value={idx} key={bundle.coins}>
              {bundle.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-200">Item Bag</h2>
          {itemBagCustomBaseline ? (
            <button
              className="px-3 py-1 text-xs rounded bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition"
              onClick={handleResetItemBagBaseline}
            >
              Reset Baseline
            </button>
          ) : (
            <button
              className="px-3 py-1 text-xs rounded bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition"
              onClick={handleSetItemBagBaseline}
              disabled={itemBagSlider === 0}
            >
              Set Baseline
            </button>
          )}
        </div>
        <input
          type="range"
          min={0}
          max={itemBagMaxUpgrades}
          value={itemBagSlider}
          onChange={(e) => setItemBagSlider(Number(e.target.value))}
          className="w-full accent-blue-400"
        />
        <div className="flex justify-between text-sm mt-1 text-gray-400">
          <span>
            Upgrades: <b>{itemBagSlider}</b>
          </span>
          <span>
            Size: <b>{itemBagBaseline + itemBagSlider * ITEM_BAG_STEP}</b> /{" "}
            {ITEM_BAG_MAX}
            {itemBagCustomBaseline && (
              <span className="ml-2 px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-xs font-semibold align-middle">
                Baseline: {itemBagBaseline}
              </span>
            )}
          </span>
        </div>
        <div className="mt-2 text-blue-300 font-medium">
          Cost: <span className="font-bold">{itemBagTotalCoins} PokéCoin</span>{" "}
          (<span className="font-bold">${itemBagTotalUSD} USD</span>)
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-200">
            Pokémon Storage
          </h2>
          {pokemonStorageCustomBaseline ? (
            <button
              className="px-3 py-1 text-xs rounded bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition"
              onClick={handleResetPokemonStorageBaseline}
            >
              Reset Baseline
            </button>
          ) : (
            <button
              className="px-3 py-1 text-xs rounded bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition"
              onClick={handleSetPokemonStorageBaseline}
              disabled={pokemonStorageSlider === 0}
            >
              Set Baseline
            </button>
          )}
        </div>
        <input
          type="range"
          min={0}
          max={pokemonStorageMaxUpgrades}
          value={pokemonStorageSlider}
          onChange={(e) => setPokemonStorageSlider(Number(e.target.value))}
          className="w-full accent-green-400"
        />
        <div className="flex justify-between text-sm mt-1 text-gray-400">
          <span>
            Upgrades: <b>{pokemonStorageSlider}</b>
          </span>
          <span>
            Size:{" "}
            <b>
              {pokemonStorageBaseline +
                pokemonStorageSlider * POKEMON_STORAGE_STEP}
            </b>{" "}
            / {POKEMON_STORAGE_MAX}
            {pokemonStorageCustomBaseline && (
              <span className="ml-2 px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-xs font-semibold align-middle">
                Baseline: {pokemonStorageBaseline}
              </span>
            )}
          </span>
        </div>
        <div className="mt-2 text-green-300 font-medium">
          Cost:{" "}
          <span className="font-bold">{pokemonStorageTotalCoins} PokéCoin</span>{" "}
          (<span className="font-bold">${pokemonStorageTotalUSD} USD</span>)
        </div>
      </div>
      <hr className="my-6 border-gray-700" />
      <div className="text-xl font-bold text-center text-purple-300">
        Total: {totalCoins} PokéCoin (
        <span className="font-bold">${totalUSD} USD</span>)
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">
        Bundle: {selectedBundle.label} ({selectedBundle.coins} PokéCoin @ $
        {selectedBundle.price})
      </div>
    </div>
  );
}
