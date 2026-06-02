import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface AttendanceData {
  name: string;
  value: number;
  color: string;
}

interface AttendancePieChartProps {
  data: AttendanceData[];
  title?: string;
}

export function AttendancePieChart({ data, title = "Attendance Distribution" }: AttendancePieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-5 h-full">
      <h3 className="font-semibold mb-4 text-sm">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} students`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: item.color }}
            />
            <p className="text-xs font-medium">{item.name}</p>
            <p className="text-sm font-semibold">{item.value}</p>
            <p className="text-xs text-gray-500">{((item.value / total) * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
