import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check, Sparkles } from "lucide-react";

// Debounce a changing value.
function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

// Fetches which supported countries match the given zip code.
function useZipSuggestedCountries(zip) {
  const debouncedZip = useDebouncedValue(zip, 400);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedZip || debouncedZip.trim().length < 3) {
      setMatches([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/suggest-country?zip=${encodeURIComponent(debouncedZip)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setMatches(data.matches || []);
      })
      .catch(() => {
        if (!cancelled) setMatches([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedZip]);

  return { matches, loading };
}

export default function CountryDropdown({ options, value, onChange, zipCode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const { matches: suggestedMatches, loading: suggestLoading } =
    useZipSuggestedCountries(zipCode);
  const suggestedNames = useMemo(
    () => suggestedMatches.map((m) => m.name),
    [suggestedMatches]
  );

  // Auto-select if there's exactly one confident match and the user
  // hasn't already chosen a country.
  useEffect(() => {
    if (!value && suggestedNames.length === 1 && options.includes(suggestedNames[0])) {
      onChange(suggestedNames[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestedNames]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? options.filter((o) => o.toLowerCase().includes(q))
      : options;

    if (!q && suggestedNames.length) {
      const suggestedInOptions = suggestedNames.filter((n) => base.includes(n));
      const rest = base.filter((o) => !suggestedNames.includes(o));
      return [...suggestedInOptions, ...rest];
    }
    return base;
  }, [options, query, suggestedNames]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-card border border-border px-4 py-3.5 text-sm tracking-[0.02em] text-foreground/70 hover:border-primary hover:text-primary transition-colors"
      >
        <span className={value ? "text-foreground" : "text-foreground/50"}>
          {value || "Select country"}
        </span>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full border border-border bg-background shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <Search size={14} className="text-foreground/50 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {!query && suggestLoading && (
              <div className="px-3 pt-2 pb-1 text-xs text-foreground/40">
                Checking zip code...
              </div>
            )}
            {!query && !suggestLoading && suggestedNames.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 pt-2 pb-1 text-xs uppercase tracking-wide text-foreground/40">
                <Sparkles size={12} /> Matches your zip code
              </div>
            )}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-foreground/50">No matches</div>
            )}
            {filtered.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setQuery("");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                  value === option
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-primary/10 text-foreground/80"
                }`}
              >
                {option}
                {value === option && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
