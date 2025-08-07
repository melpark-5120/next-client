import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  color?: string; // 可选的颜色样式，如 text-green-600
}

export default function StatCard({ title, value, color }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${color || ''}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
