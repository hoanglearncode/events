'use client';
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, FileText, Eye, MessageSquare, ThumbsUp, Calendar, Filter, Download } from 'lucide-react';

const NewsAdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const stats = [
    { 
      title: 'Tổng bài viết', 
      value: '12,847', 
      change: '+12.5%', 
      icon: FileText, 
      color: 'var(--brand-primary)' 
    },
    { 
      title: 'Người dùng hoạt động', 
      value: '8,392', 
      change: '+8.2%', 
      icon: Users, 
      color: 'var(--brand-secondary)' 
    },
    { 
      title: 'Lượt xem', 
      value: '2.4M', 
      change: '+23.1%', 
      icon: Eye, 
      color: 'var(--brand-accent)' 
    },
    { 
      title: 'Tương tác', 
      value: '456K', 
      change: '+15.3%', 
      icon: ThumbsUp, 
      color: 'var(--brand-success)' 
    },
  ];

  // Dữ liệu lượt xem theo thời gian
  const viewsData = [
    { date: '01/01', views: 24000, users: 12000, posts: 450 },
    { date: '02/01', views: 28000, users: 14500, posts: 520 },
    { date: '03/01', views: 31000, users: 15800, posts: 580 },
    { date: '04/01', views: 27000, users: 13200, posts: 490 },
    { date: '05/01', views: 35000, users: 17500, posts: 650 },
    { date: '06/01', views: 42000, users: 21000, posts: 720 },
    { date: '07/01', views: 38000, users: 19000, posts: 680 },
  ];

  // Dữ liệu phân loại nội dung
  const categoryData = [
    { name: 'Công nghệ', value: 2840, color: '#624a2b' },
    { name: 'Kinh doanh', value: 2340, color: '#9c620f' },
    { name: 'Thể thao', value: 1890, color: '#ab936c' },
    { name: 'Giải trí', value: 2120, color: '#c9c3b6' },
    { name: 'Chính trị', value: 1650, color: '#8b7f6e' },
  ];

  // Top bài viết
  const topPosts = [
    { title: 'Công nghệ AI đột phá trong năm 2025', views: 125000, engagement: 95, category: 'Công nghệ' },
    { title: 'Thị trường chứng khoán biến động mạnh', views: 98000, engagement: 87, category: 'Kinh doanh' },
    { title: 'Giải vô địch bóng đá: Kết quả bất ngờ', views: 87000, engagement: 92, category: 'Thể thao' },
    { title: 'Phim mới phá kỷ lục doanh thu', views: 76000, engagement: 84, category: 'Giải trí' },
    { title: 'Chính sách mới về môi trường', views: 65000, engagement: 78, category: 'Chính trị' },
  ];

  // Dữ liệu tương tác theo giờ
  const engagementByHour = [
    { hour: '0h', comments: 120, likes: 450, shares: 80 },
    { hour: '4h', comments: 80, likes: 280, shares: 50 },
    { hour: '8h', comments: 340, likes: 1200, shares: 280 },
    { hour: '12h', comments: 580, likes: 1850, shares: 420 },
    { hour: '16h', comments: 620, likes: 2100, shares: 480 },
    { hour: '20h', comments: 720, likes: 2450, shares: 560 },
    { hour: '24h', comments: 480, likes: 1680, shares: 380 },
  ];

  // Dữ liệu độ tuổi người dùng
  const ageData = [
    { age: '18-24', value: 3200 },
    { age: '25-34', value: 4800 },
    { age: '35-44', value: 2900 },
    { age: '45-54', value: 1800 },
    { age: '55+', value: 1100 },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Dashboard Quản Trị
            </h1>
            <p className="text-muted-foreground">
              Tổng quan hoạt động nền tảng tin tức
            </p>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="24hours">24 giờ qua</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="90days">90 ngày qua</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card-elevated rounded-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <span className="text-brand-success text-sm font-semibold">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-muted-foreground text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Views Trend */}
        <div className="lg:col-span-2 card-elevated rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Xu hướng lượt xem</h2>
            <TrendingUp className="text-brand-primary" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#624a2b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#624a2b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#624a2b" 
                fillOpacity={1} 
                fill="url(#colorViews)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="card-elevated rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Phân loại nội dung</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Engagement by Hour */}
        <div className="card-elevated rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Tương tác theo giờ</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementByHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="comments" fill="#624a2b" name="Bình luận" />
              <Bar dataKey="likes" fill="#9c620f" name="Thích" />
              <Bar dataKey="shares" fill="#ab936c" name="Chia sẻ" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div className="card-elevated rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Phân bố độ tuổi người dùng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" />
              <YAxis dataKey="age" type="category" stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="value" fill="#624a2b" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Posts Table */}
      <div className="card-elevated rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Top bài viết nổi bật</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Tiêu đề</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Danh mục</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-semibold">Lượt xem</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-semibold">Tương tác</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-brand-primary font-bold text-lg">#{index + 1}</span>
                      <span className="text-foreground font-medium">{post.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-foreground font-semibold">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-success rounded-full"
                          style={{ width: `${post.engagement}%` }}
                        />
                      </div>
                      <span className="text-foreground font-semibold">{post.engagement}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-muted-foreground text-sm">
        <p>Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</p>
      </div>
    </div>
  );
};

export default NewsAdminDashboard;