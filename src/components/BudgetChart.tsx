import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { Budget } from './BudgetManager';
import { Transaction } from './TransactionForm';
import { cn } from '@/lib/utils';

interface BudgetChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ transactions, budgets }) => {
  const chartData = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentBudgets = budgets.filter(b => b.month === currentMonth);
    
    if (currentBudgets.length === 0) {
      return [];
    }

    return currentBudgets.map(budget => {
      const actual = transactions
        .filter(t => 
          t.type === 'expense' && 
          t.category === budget.category &&
          new Date(t.date).toISOString().slice(0, 7) === currentMonth
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const variance = actual - budget.amount;
      const variancePercentage = budget.amount > 0 ? (variance / budget.amount) * 100 : 0;

      return {
        category: budget.category,
        budget: budget.amount,
        actual,
        variance,
        variancePercentage,
        status: actual > budget.amount ? 'over' : actual > budget.amount * 0.8 ? 'near' : 'under'
      };
    }).sort((a, b) => Math.abs(b.variancePercentage) - Math.abs(a.variancePercentage));
  }, [transactions, budgets]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 finance-shadow-medium">
          <p className="font-medium text-card-foreground mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Budget:</span>
              <span className="font-medium">${data.budget.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-finance-expense" />
              <span>Actual:</span>
              <span className="font-medium">${data.actual.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Variance:</span>
              <span className={cn(
                "font-medium",
                data.variance > 0 ? "text-destructive" : "text-success"
              )}>
                {data.variance > 0 ? '+' : ''}${data.variance.toFixed(2)} ({data.variancePercentage > 0 ? '+' : ''}{data.variancePercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="finance-gradient-card finance-shadow-medium border-0">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No budget data to display
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Set up monthly budgets to see budget vs actual comparisons
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="finance-gradient-card finance-shadow-medium border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Target className="h-5 w-5 text-primary" />
          Budget vs Actual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
              />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="budget"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Budget"
              />
              <Bar
                dataKey="actual"
                fill="hsl(var(--finance-expense))"
                radius={[4, 4, 0, 0]}
                name="Actual"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {(() => {
            const totalBudget = chartData.reduce((sum, item) => sum + item.budget, 0);
            const totalActual = chartData.reduce((sum, item) => sum + item.actual, 0);
            const totalVariance = totalActual - totalBudget;
            const overBudgetCategories = chartData.filter(item => item.actual > item.budget).length;
            
            return (
              <>
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-xl font-bold text-primary">${totalBudget.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-finance-expense/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-xl font-bold text-finance-expense">${totalActual.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Over Budget Categories</p>
                  <p className="text-xl font-bold text-destructive">{overBudgetCategories}</p>
                </div>
              </>
            );
          })()}
        </div>
      </CardContent>
    </Card>
  );
}; 