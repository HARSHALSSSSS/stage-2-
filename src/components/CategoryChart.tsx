import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from './TransactionForm';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryChartProps {
  transactions: Transaction[];
}

export const CategoryChart = ({ transactions }: CategoryChartProps) => {
  // Process data for pie chart
  const categoryData = React.useMemo(() => {
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = transaction.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: 0 // Will be calculated after sorting
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8) // Show top 8 categories
      .map((item, index, array) => {
        const total = array.reduce((sum, cat) => sum + cat.amount, 0);
        return {
          ...item,
          percentage: total > 0 ? (item.amount / total) * 100 : 0
        };
      });
  }, [transactions]);

  // Chart configuration
  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    const colors = [
      'hsl(var(--finance-expense))',
      'hsl(var(--primary))',
      'hsl(var(--secondary))',
      'hsl(var(--accent))',
      'hsl(var(--muted))',
      'hsl(var(--success))',
      'hsl(var(--warning))',
      'hsl(var(--primary-glow))'
    ];

    categoryData.forEach((item, index) => {
      config[item.category] = {
        label: item.category,
        color: colors[index % colors.length]
      };
    });

    return config;
  }, [categoryData]);

  if (categoryData.length === 0) {
    return (
      <Card className="finance-card-elegant">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-finance-expense/10">
              <PieChartIcon className="h-4 w-4 text-finance-expense" />
            </div>
            <div>
              <CardTitle className="text-base">Expense Categories</CardTitle>
              <CardDescription>Breakdown by category</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          <div className="text-center">
            <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No expense data available</p>
            <p className="text-sm">Add some expense transactions to see the breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="finance-card-elegant">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-finance-expense/10">
            <PieChartIcon className="h-4 w-4 text-finance-expense" />
          </div>
          <div>
            <CardTitle className="text-base">Expense Categories</CardTitle>
            <CardDescription>Top spending categories</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
              dataKey="amount"
            >
              {categoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={chartConfig[entry.category]?.color || 'hsl(var(--muted))'} 
                />
              ))}
            </Pie>
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: payload[0].color }}
                        />
                        <span className="font-medium">{data.category}</span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        <p>${data.amount.toFixed(2)} ({data.percentage.toFixed(1)}%)</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};