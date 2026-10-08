import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Home,
  Calendar,
  Star,
  ArrowRight,
  Clock,
  Bot,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from './StatCard';
import StatusBadge from './StatusBadge';
import {
  DASHBOARD_STATS,
  EARNINGS_CHART_MONTHLY,
  EARNINGS_CHART_QUARTERLY,
  AI_INSIGHTS,
} from '../../data/dashboard';
import { formatPrice, formatDateRange } from '../../utils/formatters';

const OverviewTab = ({
  user,
  bookings = [],
  properties = [],
  onViewBookingDetails,
  loading = false,
}) => {
  const [chartView, setChartView] = useState('monthly'); // monthly | quarterly
  const [dismissedInsights, setDismissedInsights] = useState([]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Host';
  const chartData = chartView === 'monthly' ? EARNINGS_CHART_MONTHLY : EARNINGS_CHART_QUARTERLY;

  const recentBookings = bookings.slice(0, 5);
  const upcomingCheckins = bookings
    .filter((b) => b.status === 'Confirmed' || b.status === 'Pending')
    .slice(0, 3);

  const activeInsights = AI_INSIGHTS.filter((tip) => !dismissedInsights.includes(tip.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. Header Greeting & Quick Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--dark)',
              margin: '0 0 4px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome back, {firstName} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Here is what's happening with your properties and reservations today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            to="/listings/new"
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            <span>+ Host a New Stay</span>
          </Link>
        </div>
      </div>

      {/* 2. 4 Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <StatCard
          title="Total Earnings"
          value={DASHBOARD_STATS.totalEarnings.formatted}
          trend={DASHBOARD_STATS.totalEarnings.trend}
          isPositive={DASHBOARD_STATS.totalEarnings.isPositive}
          icon={DollarSign}
          iconBg="#ECFDF5"
          iconColor="#059669"
          loading={loading}
        />
        <StatCard
          title="Active Listings"
          value={properties.length || DASHBOARD_STATS.activeListings.formatted}
          trend={DASHBOARD_STATS.activeListings.trend}
          isPositive={DASHBOARD_STATS.activeListings.isPositive}
          icon={Home}
          iconBg="#EFF6FF"
          iconColor="#2563EB"
          loading={loading}
        />
        <StatCard
          title="Upcoming Bookings"
          value={bookings.filter((b) => b.status === 'Confirmed').length || DASHBOARD_STATS.upcomingBookings.formatted}
          trend={DASHBOARD_STATS.upcomingBookings.trend}
          isPositive={DASHBOARD_STATS.upcomingBookings.isPositive}
          icon={Calendar}
          iconBg="#FFFBEB"
          iconColor="#D97706"
          loading={loading}
        />
        <StatCard
          title="Average Rating"
          value={DASHBOARD_STATS.averageRating.formatted}
          trend={DASHBOARD_STATS.averageRating.trend}
          isPositive={DASHBOARD_STATS.averageRating.isPositive}
          icon={Star}
          iconBg="#FEF3C7"
          iconColor="#F59E0B"
          loading={loading}
        />
      </div>

      {/* 3. AI Insights Banner Card */}
      {activeInsights.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 50%, #F5F3FF 100%)',
            border: '1px solid #E9D5FF',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.06)',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Bot size={24} color="#7C3AED" />
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  margin: 0,
                  color: '#581C87',
                  letterSpacing: '-0.01em',
                }}
              >
                Wanderlust AI Insights & Optimization
              </h3>
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#7C3AED',
                background: '#EDE9FE',
                padding: '4px 10px',
                borderRadius: '9999px',
              }}
            >
              {activeInsights.length} Smart Recommendations
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {activeInsights.map((insight) => (
              <div
                key={insight.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 18px',
                  border: '1px solid rgba(233, 213, 255, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        color: '#4C1D95',
                      }}
                    >
                      {insight.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#7C3AED',
                        background: '#F3E8FF',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {insight.badge}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      color: '#581C87',
                      margin: '0 0 14px 0',
                    }}
                  >
                    {insight.description}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 8,
                    borderTop: '1px solid #F3E8FF',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setDismissedInsights((prev) => [...prev, insight.id])}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9CA3AF',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Dismiss
                  </button>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#7C3AED',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    {insight.actionText} <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Earnings Chart Section */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                margin: '0 0 4px 0',
                color: 'var(--dark)',
              }}
            >
              Revenue & Earnings Growth
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Historical payout performance over the last 6 months
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              background: '#F3F4F6',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <button
              type="button"
              onClick={() => setChartView('monthly')}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: chartView === 'monthly' ? 700 : 500,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: chartView === 'monthly' ? '#FFFFFF' : 'transparent',
                color: chartView === 'monthly' ? '#111827' : '#6B7280',
                boxShadow: chartView === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setChartView('quarterly')}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: chartView === 'quarterly' ? 700 : 500,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: chartView === 'quarterly' ? '#FFFFFF' : 'transparent',
                color: chartView === 'quarterly' ? '#111827' : '#6B7280',
                boxShadow: chartView === 'quarterly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Quarterly
            </button>
          </div>
        </div>

        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF385C" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FF385C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Earnings']}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#FF385C"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#earningsGradient)"
                activeDot={{ r: 6, fill: '#FF385C', stroke: '#FFFFFF', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. 2-Column Split: Recent Bookings Table & Upcoming Check-ins */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
          gap: '24px',
        }}
        className="dashboard-overview-split"
      >
        {/* Left Column: Recent Bookings Table */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Recent Bookings</h3>
            <Link
              to="/dashboard/bookings"
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#FF385C',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'none',
              }}
            >
              <span>View all</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '10px 12px 10px 0', fontSize: '0.78rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>
                    Guest
                  </th>
                  <th style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>
                    Property
                  </th>
                  <th style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>
                    Dates
                  </th>
                  <th style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '10px 0 10px 12px', fontSize: '0.78rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr
                    key={b._id}
                    onClick={() => onViewBookingDetails && onViewBookingDetails(b)}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    className="hover:bg-slate-50"
                  >
                    <td style={{ padding: '12px 12px 12px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={b.guest?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={b.guest?.name}
                          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                          {b.guest?.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span
                        style={{
                          display: 'block',
                          maxWidth: 160,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: 500,
                        }}
                      >
                        {b.property?.title}
                      </span>
                    </td>
                    <td style={{ padding: '12px 12px', fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {formatDateRange(b.startDate, b.endDate)}
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td style={{ padding: '12px 0 12px 12px', textAlign: 'right', fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>
                      {formatPrice(b.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Upcoming Check-ins */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Upcoming Check-ins</h3>
              <Clock size={16} color="#9CA3AF" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {upcomingCheckins.map((checkin) => (
                <div
                  key={checkin._id}
                  onClick={() => onViewBookingDetails && onViewBookingDetails(checkin)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #F3F4F6',
                    background: '#FAFAFA',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img
                        src={checkin.guest?.avatar}
                        alt={checkin.guest?.name}
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        {checkin.guest?.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#2563EB',
                        backgroundColor: '#EFF6FF',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      {new Date(checkin.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    📍 {checkin.property?.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                    {checkin.nights} nights · {checkin.guests} guests · {checkin.guest?.phone}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #F3F4F6' }}>
            <Link
              to="/dashboard/bookings"
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px', justifyContent: 'center' }}
            >
              Manage All Check-ins
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
