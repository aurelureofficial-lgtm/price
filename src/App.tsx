// UPDATED: Added Wax Type (Soy / Paraffin) + Custom Rate Input
import React, { useEffect, useMemo, useState } from "react";

const DROPS_PER_ML = 20;
const COLOR_PRICE_PER_100_ML = 149;
const HISTORY_KEY = "candle_calc_history_v2";

function currency(n) {
  if (!isFinite(n)) return "₹0.00";
  return `₹${n.toFixed(2)}`;
}

export default function CandlePriceCalculator() {
  const [name, setName] = useState("");

  // NEW: Wax Type + Rate
  const [waxType, setWaxType] = useState("soy");
  const [waxRate, setWaxRate] = useState(155); // ₹ per kg

  const [jar, setJar] = useState(0);
  const [waxGrams, setWaxGrams] = useState(0);
  const [wick, setWick] = useState(0);
  const [fragPricePerL, setFragPricePerL] = useState(0);
  const [fragGrams, setFragGrams] = useState(0);
  const [colorDrops, setColorDrops] = useState(0);
  const [packBox, setPackBox] = useState(0);
  const [packSticker, setPackSticker] = useState(0);
  const [packRibbon, setPackRibbon] = useState(0);
  const [additional, setAdditional] = useState(0);
  const [profitPct, setProfitPct] = useState(0);

  const calc = useMemo(() => {
    const jarCost = Number(jar) || 0;
    const wickCost = Number(wick) || 0;

    const grams = Number(waxGrams) || 0;

    // UPDATED WAX CALCULATION (based on selected rate)
    const waxCost = (grams / 1000) * (Number(waxRate) || 0);

    const pricePerGram = (Number(fragPricePerL) || 0) / 1000;
    const fragCost = pricePerGram * (Number(fragGrams) || 0);

    const pricePerMl = COLOR_PRICE_PER_100_ML / 100;
    const pricePerDrop = pricePerMl / DROPS_PER_ML;
    const colorCost = pricePerDrop * (Number(colorDrops) || 0);

    const packaging =
      (Number(packBox) || 0) +
      (Number(packSticker) || 0) +
      (Number(packRibbon) || 0);

    const extra = Number(additional) || 0;

    const total =
      jarCost + wickCost + waxCost + fragCost + colorCost + packaging + extra;

    const profitAmount =
      (Number(profitPct) || 0) > 0
        ? (total * (Number(profitPct) || 0)) / 100
        : 0;

    const sellingPrice = total + profitAmount;

    return {
      waxCost,
      fragCost,
      colorCost,
      jarCost,
      wickCost,
      packaging,
      extra,
      total,
      profitAmount,
      sellingPrice,
      pricePerDrop,
    };
  }, [
    jar,
    wick,
    waxGrams,
    waxRate,
    fragPricePerL,
    fragGrams,
    colorDrops,
    packBox,
    packSticker,
    packRibbon,
    additional,
    profitPct,
  ]);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Candle Calculator</h2>

      {/* Wax Type */}
      <div className="mb-3">
        <label className="block font-medium">Wax Type</label>
        <select
          value={waxType}
          onChange={(e) => setWaxType(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="soy">Soy Wax</option>
          <option value="paraffin">Paraffin Wax</option>
        </select>
      </div>

      {/* Wax Rate */}
      <div className="mb-3">
        <label className="block font-medium">
          Wax Rate (₹ per KG)
        </label>
        <input
          type="number"
          value={waxRate}
          onChange={(e) => setWaxRate(parseFloat(e.target.value))}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Wax Grams */}
      <div className="mb-3">
        <label className="block font-medium">Wax (grams)</label>
        <input
          type="number"
          value={waxGrams}
          onChange={(e) => setWaxGrams(parseFloat(e.target.value))}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Jar */}
      <div className="mb-3">
        <label className="block font-medium">Jar Price</label>
        <input
          type="number"
          value={jar}
          onChange={(e) => setJar(parseFloat(e.target.value))}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Result */}
      <div className="mt-6 border-t pt-4">
        <p>Wax Cost: {currency(calc.waxCost)}</p>
        <p>Total Cost: {currency(calc.total)}</p>
        <p>Selling Price: {currency(calc.sellingPrice)}</p>
      </div>
    </div> 
  );
}
