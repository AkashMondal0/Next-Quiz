'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles, Star } from 'lucide-react';

export default function GameSettingsCard({ isDark }: { isDark: boolean }) {
  const settings = [
    { icon: Clock, label: 'Time per question', value: '30s', color: 'purple' },
    { icon: Sparkles, label: 'Questions', value: '10', color: 'blue' },
    { icon: Star, label: 'Difficulty', value: 'Medium', color: 'yellow' },
  ];

  return (
    <Card className={`${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-purple-200'} border-2 backdrop-blur-xl shadow-2xl`}>
      <CardHeader>
        <CardTitle className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Game Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {settings.map((s, i) => (
          <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/60' : 'bg-purple-50'}`}>
            <div className="flex items-center gap-2">
              <s.icon className={`w-4 h-4 text-${s.color}-400`} />
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.label}</span>
            </div>
            <Badge className={`bg-gradient-to-r from-${s.color}-500 to-${s.color === 'yellow' ? 'orange' : 'pink'}-500 text-white`}>
              {s.value}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
