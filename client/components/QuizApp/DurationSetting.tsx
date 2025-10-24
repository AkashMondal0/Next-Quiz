import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider'; // assuming shadcn/ui slider

export default function DurationSetting({ value, setValue, isDark }: { value: number; setValue: (v: number) => void; isDark: boolean; }) {
  return (
    <div className="space-y-2">
      <Label className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
        Match Duration: <span className="font-bold">{value} min</span>
      </Label>
      <Slider
        min={5}
        max={60}
        step={5}
        value={[value]}
        onValueChange={(v) => setValue(v[0])}
        className="w-full"
      />
    </div>
  );
}
