import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Calendar,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Transaction } from './TransactionForm';
import { Budget } from './BudgetManager';
import { cn } from '@/lib/utils';

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const SpendingInsights: React.FC<SpendingInsightsProps> = ({ 
  transactions, 
  budgets 
}) => {
  const insights = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().slice(0, 7);

    // Current month data
    const currentMonthTransactions = transactions.filter(t => 
      new Date(t.date).toISOString().slice(0, 7) === currentMonth
    );
    
    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Last month data
    const lastMonthTransactions = transactions.filter(t => 
      new Date(t.date).toISOString().slice(0, 7) === lastMonthStr
    );
    
    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Spending change
    const spendingChange = lastMonthExpenses > 0 
      ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    // Top spending categories this month
    const categorySpending = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    // Budget analysis
    const currentBudgets = budgets.filter(b => b.month === currentMonth);
    const budgetAnalysis = currentBudgets.map(budget => {
      const actual = currentMonthTransactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        category: budget.category,
        budget: budget.amount,
        actual,
        variance: actual - budget.amount,
        percentage: (actual / budget.amount) * 100
      };
    });

    const overBudgetCategories = budgetAnalysis.filter(b => b.actual > b.budget);
    const underBudgetCategories = budgetAnalysis.filter(b => b.actual < b.budget * 0.8);

    // Daily spending pattern
    const dailySpending = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const day = new Date(t.date).getDate();
        acc[day] = (acc[day] || 0) + t.amount;
        return acc;
      }, {} as Record<number, number>);

    const averageDailySpending = Object.values(dailySpending).length > 0
      ? Object.values(dailySpending).reduce((sum, amount) => sum + amount, 0) / Object.values(dailySpending).length
      : 0;

    // Generate insights
    const insightsList = [];

    // Spending trend insight
    if (spendingChange > 10) {
      insightsList.push({
        type: 'warning',
        icon: TrendingUp,
        title: 'Spending Increased',
        description: `Your spending is ${Math.abs(spendingChange).toFixed(1)}% higher than last month.`,
        action: 'Consider reviewing your recent expenses.'
      });
    } else if (spendingChange < -10) {
      insightsList.push({
        type: 'success',
        icon: TrendingDown,
        title: 'Spending Decreased',
        description: `Great job! Your spending is ${Math.abs(spendingChange).toFixed(1)}% lower than last month.`,
        action: 'Keep up the good financial habits!'
      });
    }

    // Budget insights
    if (overBudgetCategories.length > 0) {
      insightsList.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Over Budget Categories',
        description: `${overBudgetCategories.length} category${overBudgetCategories.length > 1 ? 'ies' : 'y'} over budget.`,
        action: 'Review spending in these categories and adjust if needed.'
      });
    }

    if (underBudgetCategories.length > 0) {
      insightsList.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Under Budget Categories',
        description: `${underBudgetCategories.length} category${underBudgetCategories.length > 1 ? 'ies' : 'y'} under budget.`,
        action: 'Consider reallocating unused budget to other areas.'
      });
    }

    // Top spending category insight
    if (topCategories.length > 0) {
      const [topCategory, topAmount] = topCategories[0];
      const topPercentage = (topAmount / currentMonthExpenses) * 100;
      
      if (topPercentage > 40) {
        insightsList.push({
          type: 'warning',
          icon: Target,
          title: 'High Category Concentration',
          description: `${topCategory} represents ${topPercentage.toFixed(1)}% of your spending.`,
          action: 'Consider diversifying your spending across categories.'
        });
      }
    }

    // Daily spending insight
    if (averageDailySpending > 100) {
      insightsList.push({
        type: 'warning',
        icon: Calendar,
        title: 'High Daily Spending',
        description: `You're averaging $${averageDailySpending.toFixed(2)} per day this month.`,
        action: 'Track daily spending to identify unnecessary expenses.'
      });
    }

    return {
      spendingChange,
      topCategories,
      budgetAnalysis,
      overBudgetCategories: overBudgetCategories.length,
      underBudgetCategories: underBudgetCategories.length,
      averageDailySpending,
      insights: insightsList
    };
  }, [transactions, budgets]);

  return (
    <Card className="finance-gradient-card finance-shadow-medium border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lightbulb className="h-5 w-5 text-primary" />
          Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              {insights.spendingChange > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-destructive" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-success" />
              )}
              <span className="text-sm text-muted-foreground">vs Last Month</span>
            </div>
            <p className={cn(
              "text-xl font-bold",
              insights.spendingChange > 0 ? "text-destructive" : "text-success"
            )}>
              {insights.spendingChange > 0 ? '+' : ''}{insights.spendingChange.toFixed(1)}%
            </p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Over Budget</span>
            </div>
            <p className="text-xl font-bold text-destructive">
              {insights.overBudgetCategories}
            </p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Under Budget</span>
            </div>
            <p className="text-xl font-bold text-success">
              {insights.underBudgetCategories}
            </p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Daily Average</span>
            </div>
            <p className="text-xl font-bold text-warning">
              ${insights.averageDailySpending.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Top Spending Categories */}
        {insights.topCategories.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Top Spending Categories</h3>
            <div className="grid gap-3">
              {insights.topCategories.map(([category, amount], index) => (
                <div key={category} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium">{category}</span>
                  </div>
                  <span className="font-bold text-finance-expense">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {insights.insights.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Recommendations</h3>
            <div className="grid gap-3">
              {insights.insights.map((insight, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    insight.type === 'warning' && "bg-warning/10 border-warning",
                    insight.type === 'success' && "bg-success/10 border-success"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      insight.type === 'warning' && "bg-warning/20",
                      insight.type === 'success' && "bg-success/20"
                    )}>
                      <insight.icon className={cn(
                        "h-4 w-4",
                        insight.type === 'warning' && "text-warning",
                        insight.type === 'success' && "text-success"
                      )} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {insight.description}
                      </p>
                      <p className="text-xs font-medium text-primary">
                        💡 {insight.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No specific insights available</p>
            <p className="text-sm">Add more transactions and budgets to get personalized insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 