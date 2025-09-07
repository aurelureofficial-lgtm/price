import React, { useEffect, useMemo, useRef, useState } from "react";

const DROPS_PER_ML = 20; // common approximation
const COLOR_PRICE_PER_100_ML = 149; // ₹
const HISTORY_KEY = "candle_calc_history_v2";

function currency(n) {
  if (!isFinite(n)) return "₹0.00";
  return `₹${n.toFixed(2)}`;
}

export default function CandlePriceCalculator() {
  // Inputs
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

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

  // GST
  const [gstPct, setGstPct] = useState(18);
  const [applyGst, setApplyGst] = useState(false);

  const [history, setHistory] = useState([]);

  // Load history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (_) {}
  }, []);

  // Save history helper
  const pushHistory = (row) => {
    const rows = [row, ...history].slice(0, 10);
    setHistory(rows);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(rows));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  // Calculations
  const calc = useMemo(() => {
    const jarCost = Number(jar) || 0;
    const wickCost = Number(wick) || 0;

    const grams = Number(waxGrams) || 0;
    const half = grams / 2;
    const wax1 = (half / 1000) * 170;
    const wax2 = (half / 1000) * 175;
    const waxCost = wax1 + wax2;

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

    const gstAmount = applyGst
      ? (sellingPrice * (Number(gstPct) || 0)) / 100
      : 0;
    const finalPrice = sellingPrice + gstAmount;

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
      finalPrice,
      gstAmount,
      pricePerDrop,
    };
  }, [
    jar,
    wick,
    waxGrams,
    fragPricePerL,
    fragGrams,
    colorDrops,
    packBox,
    packSticker,
    packRibbon,
    additional,
    profitPct,
    gstPct,
    applyGst,
  ]);

  // Copy results
  const copyResults = async () => {
    const text =
      `Candle: ${name || "Unnamed"}\n\n` +
      `Wax: ${currency(calc.waxCost)}\n` +
      `Fragrance: ${currency(calc.fragCost)}\n` +
      `Color: ${currency(calc.colorCost)}\n` +
      `Wick: ${currency(calc.wickCost)}\n` +
      `Jar: ${currency(calc.jarCost)}\n` +
      `Packaging: ${currency(calc.packaging)}\n` +
      `Additional: ${currency(calc.extra)}\n` +
      `Total Cost: ${currency(calc.total)}\n` +
      `Profit (${profitPct || 0}%): ${currency(calc.profitAmount)}\n` +
      `Selling Price: ${currency(calc.sellingPrice)}\n` +
      (applyGst
        ? `GST (${gstPct || 0}%): ${currency(
            calc.gstAmount
          )}\nFinal Price: ${currency(calc.finalPrice)}`
        : "");
    try {
      await navigator.clipboard.writeText(text);
      alert("Results copied to clipboard ✅");
    } catch (e) {
      alert("Copy failed. You can select and copy manually.");
    }
  };

  // Print
  const printPDF = () => {
    window.print();
  };

  // Save to history
  const saveToHistory = () => {
    pushHistory({
      ts: new Date().toISOString(),
      inputs: {
        name,
        jar,
        waxGrams,
        wick,
        fragPricePerL,
        fragGrams,
        colorDrops,
        packBox,
        packSticker,
        packRibbon,
        additional,
        profitPct,
        gstPct,
        applyGst,
      },
      outputs: calc,
      image,
    });
  };

  // Reset inputs
  const resetAll = () => {
    setName("");
    setImage(null);
    setJar(0);
    setWaxGrams(0);
    setWick(0);
    setFragPricePerL(0);
    setFragGrams(0);
    setColorDrops(0);
    setPackBox(0);
    setPackSticker(0);
    setPackRibbon(0);
    setAdditional(0);
    setProfitPct(0);
    setGstPct(18);
    setApplyGst(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 print:p-0">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 md:p-6 grid md:grid-cols-2 gap-6 print:shadow-none print:rounded-none print:p-0">
        {/* Left: Results */}
        <div className="rounded-2xl border border-slate-200 p-4 md:p-6">
          {name && (
            <h2 className="text-2xl font-bold mb-2 text-slate-900">{name}</h2>
          )}
          {image && (
            <img
              src={image}
              alt={name}
              className="w-full h-auto rounded-2xl object-contain mb-4"
            />
          )}

          <h3 className="text-xl font-semibold mb-4 text-slate-800">
            Calculation Breakdown
          </h3>
          <div className="space-y-2 text-slate-700">
            <Row label="Wax Price" value={calc.waxCost} />
            <Row label="Fragrance Price" value={calc.fragCost} />
            <Row
              label={`Color Price (₹${calc.pricePerDrop.toFixed(4)} / drop)`}
              value={calc.colorCost}
            />
            <Row label="Wick Cost" value={calc.wickCost} />
            <Row label="Jar Price" value={calc.jarCost} />
            <Row label="Packaging Subtotal" value={calc.packaging} />
            <Row label="Additional Charges" value={calc.extra} />
            <div className="h-px bg-slate-200 my-2" />
            <Row label="Total Cost" value={calc.total} strong />
            <Row
              label={`Profit (${profitPct || 0}%)`}
              value={calc.profitAmount}
            />
            <Row
              label="Selling Price (Excl. GST)"
              value={calc.sellingPrice}
              strong
            />
            {applyGst && (
              <>
                <Row label={`GST (${gstPct || 0}%)`} value={calc.gstAmount} />
                <Row
                  label="Final Price (Incl. GST)"
                  value={calc.finalPrice}
                  strong
                />
              </>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 print:hidden">
            <button
              onClick={copyResults}
              className="px-3 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90"
            >
              Copy Results
            </button>
            <button
              onClick={printPDF}
              className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300"
            >
              Download PDF
            </button>
            <button
              onClick={saveToHistory}
              className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:opacity-90 col-span-2"
            >
              Save to History
            </button>
          </div>
        </div>

        {/* Right: Inputs */}
        <div className="rounded-2xl border border-slate-200 p-4 md:p-6 print:hidden">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Enter Details
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Candle Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="My Candle"
              />
            </Field>

            <Field label="Upload Image">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setImage(ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Field>

            <Field label="Jar Price (₹)">
              <NumberInput value={jar} onChange={setJar} placeholder="0" />
            </Field>
            <Field label="Wax (grams)">
              <NumberInput
                value={waxGrams}
                onChange={setWaxGrams}
                placeholder="200"
              />
            </Field>
            <Field label="Wick Cost (₹)">
              <NumberInput value={wick} onChange={setWick} placeholder="0" />
            </Field>
            <Field label="Fragrance Price (₹ per Liter)">
              <NumberInput
                value={fragPricePerL}
                onChange={setFragPricePerL}
                placeholder="1200"
              />
            </Field>
            <Field label="Fragrance Added (grams)">
              <NumberInput
                value={fragGrams}
                onChange={setFragGrams}
                placeholder="6"
              />
            </Field>
            <Field
              label={`Color Drops (₹${(
                COLOR_PRICE_PER_100_ML /
                100 /
                DROPS_PER_ML
              ).toFixed(4)}/drop)`}
              hint="149 for 100ml; ~20 drops per ml"
            >
              <NumberInput
                value={colorDrops}
                onChange={setColorDrops}
                placeholder="10"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Box (₹)">
                <NumberInput
                  value={packBox}
                  onChange={setPackBox}
                  placeholder="0"
                />
              </Field>
              <Field label="Sticker (₹)">
                <NumberInput
                  value={packSticker}
                  onChange={setPackSticker}
                  placeholder="0"
                />
              </Field>
              <Field label="Ribbon (₹)">
                <NumberInput
                  value={packRibbon}
                  onChange={setPackRibbon}
                  placeholder="0"
                />
              </Field>
            </div>

            <Field label="Additional Charges (₹)">
              <NumberInput
                value={additional}
                onChange={setAdditional}
                placeholder="0"
              />
            </Field>
            <Field label="Profit %">
              <NumberInput
                value={profitPct}
                onChange={setProfitPct}
                placeholder="30"
              />
            </Field>

            {/* GST Section */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={applyGst}
                onChange={(e) => setApplyGst(e.target.checked)}
              />
              <span className="font-medium text-slate-700">Apply GST</span>
              {applyGst && (
                <input
                  type="number"
                  value={gstPct}
                  onChange={(e) => setGstPct(parseFloat(e.target.value))}
                  className="w-20 rounded-xl border border-slate-300 px-2 py-1 ml-2"
                  placeholder="18"
                />
              )}
              {applyGst && <span className="text-slate-600">%</span>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={resetAll}
                className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300"
              >
                Reset
              </button>
              <button className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:opacity-90">
                Calculate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="max-w-6xl mx-auto mt-6 bg-white rounded-2xl shadow-xl p-4 md:p-6 print:hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            Recent Calculations
          </h3>
          <button
            onClick={clearHistory}
            className="text-sm px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300"
          >
            Clear
          </button>
        </div>
        {history.length === 0 ? (
          <p className="text-slate-500 mt-2">
            No history yet. Click "Save to History" after a calculation.
          </p>
        ) : (
          <div className="overflow-auto mt-3">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Time</Th>
                  <Th>Name</Th>
                  <Th>Total</Th>
                  <Th>Profit %</Th>
                  <Th>Selling Price</Th>
                  <Th>Final Price</Th>
                  <Th>Wax g</Th>
                  <Th>Frag g</Th>
                  <Th>Color drops</Th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-t">
                    <Td>{new Date(h.ts).toLocaleString()}</Td>
                    <Td>{h.inputs.name || "-"}</Td>
                    <Td>{currency(h.outputs.total)}</Td>
                    <Td>{h.inputs.profitPct || 0}%</Td>
                    <Td>{currency(h.outputs.sellingPrice)}</Td>
                    <Td>
                      {h.inputs.applyGst ? currency(h.outputs.finalPrice) : "-"}
                    </Td>
                    <Td>{h.inputs.waxGrams}</Td>
                    <Td>{h.inputs.fragGrams}</Td>
                    <Td>{h.inputs.colorDrops}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          img { max-height: 500px; object-fit: contain; }
        }
      `}</style>
    </div>
  );
}

function Row({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={strong ? "font-semibold" : ""}>{currency(value)}</span>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function NumberInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  );
}

function Th({ children }) {
  return <th className="px-3 py-2 font-medium text-slate-700">{children}</th>;
}
function Td({ children }) {
  return (
    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{children}</td>
  );
}
