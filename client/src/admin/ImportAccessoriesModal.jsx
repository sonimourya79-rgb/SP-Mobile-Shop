import { useState } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import api from '../api/axios';

let rowIdCounter = 0;
function nextRowId() {
  rowIdCounter += 1;
  return rowIdCounter;
}

function getField(raw, key) {
  const foundKey = Object.keys(raw).find((k) => k.trim().toLowerCase() === key);
  return foundKey ? String(raw[foundKey] ?? '').trim() : '';
}

function normalizeRow(raw, categories) {
  const name = getField(raw, 'name');
  const description = getField(raw, 'description');
  const rawCategory = getField(raw, 'category');
  const category = categories.find((c) => c.toLowerCase() === rawCategory.toLowerCase()) || 'Other';
  const price = getField(raw, 'price');
  const stock = getField(raw, 'stock');

  return {
    _rowId: nextRowId(),
    name,
    description,
    category,
    price: price ? String(Number(price) || 0) : '0',
    stock: stock ? String(Number(stock) || 0) : '0',
    isActive: true,
    files: [],
  };
}

const TEMPLATE_URL = '/templates/accessories-import-template.xlsx';

export default function ImportAccessoriesModal({ categories, onClose, onImported }) {
  const [rows, setRows] = useState(null); // null = no file parsed yet
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data
          .map((raw) => normalizeRow(raw, categories))
          .filter((r) => r.name); // drop fully-blank rows
        if (parsed.length === 0) {
          toast.error('No usable rows found — make sure the file has a "Name" column with values.');
          return;
        }
        setRows(parsed);
      },
      error: () => toast.error('Failed to read the file. Please make sure it is a valid CSV.'),
    });
  }

  function updateRow(rowId, field, value) {
    setRows((prev) => prev.map((r) => (r._rowId === rowId ? { ...r, [field]: value } : r)));
  }

  function removeRow(rowId) {
    setRows((prev) => prev.filter((r) => r._rowId !== rowId));
  }

  const invalidCount = rows ? rows.filter((r) => !r.name.trim() || Number(r.price) <= 0).length : 0;

  async function handleSubmitAll() {
    if (!rows || rows.length === 0) return;
    setSubmitting(true);
    setProgress({ done: 0, total: rows.length });
    let successCount = 0;
    let failCount = 0;

    for (const row of rows) {
      try {
        const data = new FormData();
        data.append('name', row.name);
        data.append('description', row.description);
        data.append('category', row.category);
        data.append('price', row.price);
        data.append('stock', row.stock);
        data.append('isActive', row.isActive);
        row.files.forEach((f) => data.append('images', f));

        await api.post('/products', data);
        successCount += 1;
      } catch {
        failCount += 1;
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    setSubmitting(false);
    if (failCount === 0) {
      toast.success(`Imported ${successCount} accessories`);
    } else {
      toast.error(`Imported ${successCount}, failed ${failCount} — check required fields`);
    }
    onImported();
  }

  return (
    <div className="fixed inset-0 bg-navy-950/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy-900">Import Accessories from Excel/CSV</h2>
          <button onClick={onClose} className="text-navy-400 hover:text-navy-700 text-xl leading-none">×</button>
        </div>

        {!rows ? (
          <div className="space-y-4">
            <div className="bg-navy-50 border border-navy-100 rounded-lg p-4 text-sm text-navy-600">
              <p className="mb-2">
                <strong>Step 1:</strong>{' '}
                <a href={TEMPLATE_URL} download className="text-navy-700 underline hover:text-gold-600 font-medium">
                  Download the Excel template
                </a>{' '}
                and fill in your accessories — columns are <code>Name</code>, <code>Category</code>,{' '}
                <code>Price</code>, <code>Stock</code>, <code>Description</code> (Category/Description optional;
                the template's second sheet lists the exact category names to use).
              </p>
              <p>
                <strong>Step 2:</strong> in Excel, use <strong>File → Save As → CSV</strong> to save your filled-in
                sheet, then upload that CSV file below.
              </p>
            </div>
            <input type="file" accept=".csv,text/csv" onChange={handleFile} className="w-full text-sm" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 text-sm text-navy-500">
              <span>
                {fileName} — {rows.length} row{rows.length === 1 ? '' : 's'} parsed
                {invalidCount > 0 && <span className="text-red-500 font-medium"> ({invalidCount} need fixing)</span>}
              </span>
              <span className="text-navy-400">Review, edit, and add images below before importing</span>
            </div>

            <div className="space-y-3 mb-4">
              {rows.map((row) => {
                const invalid = !row.name.trim() || Number(row.price) <= 0;
                return (
                  <div
                    key={row._rowId}
                    className={`border rounded-lg p-3 ${invalid ? 'border-red-300 bg-red-50/40' : 'border-navy-100'}`}
                  >
                    <div className="grid gap-2 sm:grid-cols-12 items-start">
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-medium text-navy-500 mb-1">Name</label>
                        <input
                          value={row.name}
                          onChange={(e) => updateRow(row._rowId, 'name', e.target.value)}
                          className="w-full border border-navy-200 rounded-md px-2 py-1.5 text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-navy-500 mb-1">Category</label>
                        <select
                          value={row.category}
                          onChange={(e) => updateRow(row._rowId, 'category', e.target.value)}
                          className="w-full border border-navy-200 rounded-md px-2 py-1.5 text-sm"
                        >
                          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-medium text-navy-500 mb-1">Price</label>
                        <input
                          type="number" min="0"
                          value={row.price}
                          onChange={(e) => updateRow(row._rowId, 'price', e.target.value)}
                          className="w-full border border-navy-200 rounded-md px-2 py-1.5 text-sm"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-medium text-navy-500 mb-1">Stock</label>
                        <input
                          type="number" min="0"
                          value={row.stock}
                          onChange={(e) => updateRow(row._rowId, 'stock', e.target.value)}
                          className="w-full border border-navy-200 rounded-md px-2 py-1.5 text-sm"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-medium text-navy-500 mb-1">Description</label>
                        <input
                          value={row.description}
                          onChange={(e) => updateRow(row._rowId, 'description', e.target.value)}
                          className="w-full border border-navy-200 rounded-md px-2 py-1.5 text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-navy-500 mb-1">Images</label>
                        <input
                          type="file" multiple accept="image/*"
                          onChange={(e) => updateRow(row._rowId, 'files', Array.from(e.target.files))}
                          className="w-full text-xs"
                        />
                        {row.files.length > 0 && (
                          <p className="text-xs text-navy-400 mt-0.5">{row.files.length} file(s) selected</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => removeRow(row._rowId)}
                        className="text-xs text-red-500 hover:text-red-600 font-medium"
                      >
                        Remove row
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-navy-100">
              <button
                type="button"
                onClick={() => { setRows(null); setFileName(''); }}
                disabled={submitting}
                className="border border-navy-200 rounded-md px-4 py-2 font-medium text-navy-700 hover:bg-navy-50 disabled:opacity-50"
              >
                Choose Different File
              </button>
              <button
                type="button"
                onClick={handleSubmitAll}
                disabled={submitting || rows.length === 0 || invalidCount > 0}
                className="flex-1 bg-navy-800 text-white rounded-md py-2 font-semibold hover:bg-navy-700 disabled:opacity-50"
              >
                {submitting ? `Importing ${progress.done}/${progress.total}...` : `Import ${rows.length} Accessories`}
              </button>
            </div>
            {invalidCount > 0 && (
              <p className="text-xs text-red-500 mt-2">
                Fix the highlighted row(s) (name and a price greater than 0 are required) before importing.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
