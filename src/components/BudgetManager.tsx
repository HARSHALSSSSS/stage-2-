import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Settings, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { CATEGORIES } from './TransactionForm';
import { cn } from '@/lib/utils';

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // Format: "YYYY-MM"
}

interface BudgetManagerProps {
  transactions: any[];
  budgets: Budget[];
  onBudgetChange: (budgets: Budget[]) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  transactions,
  budgets,
  onBudgetChange,
}) => {
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
  });
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Calculate actual spending for each category this month
  const getActualSpending = (category: string) => {
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === category &&
        new Date(t.date).toISOString().slice(0, 7) === currentMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Get budget for a category
  const getBudget = (category: string) => {
    return budgets.find(b => b.category === category && b.month === currentMonth);
  };

  // Calculate budget utilization percentage
  const getBudgetUtilization = (category: string) => {
    const budget = getBudget(category);
    const actual = getActualSpending(category);
    if (!budget || budget.amount === 0) return 0;
    return (actual / budget.amount) * 100;
  };

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.amount || isNaN(Number(newBudget.amount))) {
      return;
    }

    const budgetExists = budgets.some(
      b => b.category === newBudget.category && b.month === currentMonth
    );

    if (budgetExists) {
      // Update existing budget
      const updatedBudgets = budgets.map(b =>
        b.category === newBudget.category && b.month === currentMonth
          ? { ...b, amount: Number(newBudget.amount) }
          : b
      );
      onBudgetChange(updatedBudgets);
    } else {
      // Add new budget
      const newBudgetItem: Budget = {
        id: Date.now().toString(),
        category: newBudget.category,
        amount: Number(newBudget.amount),
        month: currentMonth,
      };
      onBudgetChange([...budgets, newBudgetItem]);
    }

    setNewBudget({ category: '', amount: '' });
  };

  const handleDeleteBudget = (category: string) => {
    const updatedBudgets = budgets.filter(
      b => !(b.category === category && b.month === currentMonth)
    );
    onBudgetChange(updatedBudgets);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setNewBudget({
      category: budget.category,
      amount: budget.amount.toString(),
    });
  };

  const handleUpdateBudget = () => {
    if (!editingBudget || !newBudget.amount || isNaN(Number(newBudget.amount))) {
      return;
    }

    const updatedBudgets = budgets.map(b =>
      b.id === editingBudget.id
        ? { ...b, amount: Number(newBudget.amount) }
        : b
    );
    onBudgetChange(updatedBudgets);
    setEditingBudget(null);
    setNewBudget({ category: '', amount: '' });
  };

  const currentBudgets = budgets.filter(b => b.month === currentMonth);
  const expenseCategories = CATEGORIES.expense;

  return (
    <Card className="finance-gradient-card finance-shadow-medium border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Target className="h-5 w-5 text-primary" />
          Monthly Budgets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add/Edit Budget Form */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">
              {editingBudget ? 'Edit Budget' : 'Set New Budget'}
            </Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget-category">Category</Label>
              <Select
                value={newBudget.category}
                onValueChange={(value) => setNewBudget(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget-amount">Amount ($)</Label>
              <Input
                id="budget-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newBudget.amount}
                onChange={(e) => setNewBudget(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            
            <div className="flex items-end">
              {editingBudget ? (
                <div className="flex gap-2 w-full">
                  <Button onClick={handleUpdateBudget} className="flex-1">
                    Update
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingBudget(null);
                      setNewBudget({ category: '', amount: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button onClick={handleAddBudget} className="w-full">
                  Add Budget
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Current Budgets */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Month Budgets</h3>
          
          {currentBudgets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No budgets set for this month</p>
              <p className="text-sm">Set budgets to track your spending goals</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {currentBudgets.map((budget) => {
                const actual = getActualSpending(budget.category);
                const utilization = getBudgetUtilization(budget.category);
                const remaining = budget.amount - actual;
                const isOverBudget = actual > budget.amount;
                const isNearLimit = utilization >= 80 && utilization < 100;

                return (
                  <Card key={budget.id} className="finance-shadow-soft border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{budget.category}</h4>
                          {isOverBudget && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Over Budget
                            </Badge>
                          )}
                          {isNearLimit && (
                            <Badge variant="secondary" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Near Limit
                            </Badge>
                          )}
                          {utilization < 80 && (
                            <Badge variant="default" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              On Track
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBudget(budget)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBudget(budget.category)}
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Budget: ${budget.amount.toFixed(2)}</span>
                          <span>Spent: ${actual.toFixed(2)}</span>
                        </div>
                        
                        <Progress 
                          value={Math.min(utilization, 100)} 
                          className={cn(
                            "h-2",
                            isOverBudget && "bg-destructive/20",
                            isNearLimit && "bg-warning/20",
                            utilization < 80 && "bg-success/20"
                          )}
                        />
                        
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{utilization.toFixed(1)}% used</span>
                          <span className={cn(
                            isOverBudget ? "text-destructive" : "text-success"
                          )}>
                            {isOverBudget 
                              ? `$${Math.abs(remaining).toFixed(2)} over` 
                              : `$${remaining.toFixed(2)} remaining`
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 