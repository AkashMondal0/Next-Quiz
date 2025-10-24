import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function DifficultySelect({ value, onChange, isDark }: { value: 'Easy' | 'Medium' | 'Hard'; onChange: (v: any) => void; isDark: boolean; }) {
  const options = ['Easy', 'Medium', 'Hard'];
  return (
    <div className="space-y-2">
      <Label className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Difficulty</Label>
      <div className="flex gap-2">
        {options.map((opt) => (
          <Button
            key={opt}
            type="button"
            variant={value === opt ? 'default' : 'outline'}
            onClick={() => onChange(opt as any)}
            className={`flex-1 ${value === opt ? 'bg-blue-600 text-white' : isDark ? 'border-slate-700 text-slate-300' : ''}`}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
}
