import { memo, useCallback } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

// ============= COUNTER COMPONENT =============
const Counter = memo(function Counter({ label, value, onChange, min = 1, max = 100, isDark, textPrimaryClass, textSecondaryClass }: { label: string, value: number, onChange: (value: number) => void, min?: number, max?: number, isDark: boolean, textPrimaryClass: string, textSecondaryClass: string })  {
  const increment = useCallback(() => {
    if (value < max) onChange(value + 1);
  }, [value, max, onChange]);

  const decrement = useCallback(() => {
    if (value > min) onChange(value - 1);
  }, [value, min, onChange]);

  return (
    <div className="space-y-2">
      <Label className={`text-base font-semibold ${textPrimaryClass}`}>{label}</Label>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={decrement}
          disabled={value <= min}
          className={`h-12 w-12 rounded-xl ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-purple-200 hover:bg-purple-50'
            }`}
        >
          <Minus className="w-5 h-5" />
        </Button>
        <div className={`flex-1 h-12 flex items-center justify-center rounded-xl border-2 font-bold text-xl ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-purple-50 border-purple-200'
          } ${textPrimaryClass}`}>
          {value}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={increment}
          disabled={value >= max}
          className={`h-12 w-12 rounded-xl ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-purple-200 hover:bg-purple-50'
            }`}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <p className={`text-xs ${textSecondaryClass}`}>Min: {min} • Max: {max}</p>
    </div>
  );
});

export default Counter;