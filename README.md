# Coin Chronicle Tracker - Personal Finance Management

A comprehensive personal finance tracking application built with React, TypeScript, and modern web technologies. Track your income, expenses, set budgets, and gain insights into your spending patterns.

## Project info

**URL**: https://lovable.dev/projects/f3408904-45f9-47c6-8357-183758648444

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f3408904-45f9-47c6-8357-183758648444) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Features

### Stage 1 & 2: Core Transaction Management
- **Transaction Tracking**: Add, edit, and delete income and expense transactions
- **Category Management**: Predefined categories for organized financial tracking
- **Data Persistence**: Automatic saving to localStorage
- **Financial Summary**: Overview cards showing totals, net balance, and key metrics
- **Visual Analytics**: Monthly spending trends and category breakdowns
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Stage 3: Advanced Budgeting & Insights ✨
- **Monthly Budgets**: Set and manage category-specific monthly budgets
- **Budget vs Actual Comparison**: Visual charts showing budget performance
- **Spending Insights**: AI-powered recommendations and spending analysis
- **Budget Alerts**: Real-time notifications for over-budget categories
- **Progress Tracking**: Visual progress bars for budget utilization
- **Smart Recommendations**: Personalized financial advice based on spending patterns

## What technologies are used for this project?

This project is built with:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: shadcn/ui for consistent, accessible components
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Recharts for data visualization
- **State Management**: React hooks with localStorage persistence
- **Form Handling**: React Hook Form with validation
- **Icons**: Lucide React for beautiful, consistent icons

## Getting Started

### Quick Start
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open your browser to the local development URL

### Using the Budgeting Features

#### Setting Up Budgets
1. Navigate to the **Budgets** tab
2. Select a category from the dropdown
3. Enter your monthly budget amount
4. Click "Add Budget" to save
5. Repeat for other categories as needed

#### Monitoring Budget Performance
- **Budget Manager**: View all your budgets with progress indicators
- **Budget vs Actual Chart**: Visual comparison of planned vs actual spending
- **Progress Bars**: Color-coded indicators (green = on track, yellow = near limit, red = over budget)

#### Getting Insights
1. Navigate to the **Insights** tab
2. View spending trends and recommendations
3. Check key metrics like spending change vs last month
4. Review personalized financial advice

### Data Persistence
All your transactions and budgets are automatically saved to your browser's localStorage, so your data persists between sessions.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f3408904-45f9-47c6-8357-183758648444) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
