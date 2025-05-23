import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  // Sample data for charts
  const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 19000 },
    { month: "Mar", revenue: 15000 },
    { month: "Apr", revenue: 22000 },
    { month: "May", revenue: 28000 },
    { month: "Jun", revenue: 25000 },
  ];

  const salesData = [
    { name: "Mon", sales: 120 },
    { name: "Tue", sales: 150 },
    { name: "Wed", sales: 180 },
    { name: "Thu", sales: 140 },
    { name: "Fri", sales: 200 },
    { name: "Sat", sales: 190 },
    { name: "Sun", sales: 170 },
  ];

  const visitorData = [
    { date: "Week 1", visitors: 500 },
    { date: "Week 2", visitors: 800 },
    { date: "Week 3", visitors: 1200 },
    { date: "Week 4", visitors: 1000 },
  ];

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-start">
        <div className="pr-2">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2 text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className="p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex-shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
        </div>
      </div>
      <div className="flex items-center mt-2 sm:mt-4">
        {trend === "up" ? (
          <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
        ) : (
          <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
        )}
        <span
          className={`ml-1 text-xs sm:text-sm ${
            trend === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <button className="px-3 py-1.5 sm:px-4 sm:py-2 w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl flex items-center justify-center sm:justify-start gap-2 transition-colors text-sm sm:text-base">
          <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total Revenue"
          value="$28,450"
          change="12% vs last month"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Total Sales"
          value="1,245"
          change="5% vs last month"
          icon={ShoppingBag}
          trend="up"
        />
        <StatCard
          title="Active Users"
          value="8,432"
          change="3% vs last month"
          icon={Users}
          trend="down"
        />
        <StatCard
          title="Growth Rate"
          value="15.8%"
          change="2% vs last month"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
            Revenue Overview
          </h3>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#EAB308"
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
            Daily Sales
          </h3>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="sales" fill="#EAB308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visitors Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm lg:col-span-2">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
            Visitor Trends
          </h3>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visitorData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#EAB308"
                  strokeWidth={2}
                  dot={{ fill: "#EAB308" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
