"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, AlertTriangle, Shield, Activity } from "lucide-react"
import type { ThreatEvent } from "../types/security"

interface ThreatOverviewProps {
  threatEvents: ThreatEvent[]
  onExport: () => void
}

const ThreatOverview: React.FC<ThreatOverviewProps> = ({ threatEvents, onExport }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "#ef4444"
      case "High":
        return "#f97316"
      case "Medium":
        return "#eab308"
      case "Low":
        return "#22c55e"
      default:
        return "#6b7280"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-500"
      case "Investigating":
        return "bg-yellow-500"
      case "Resolved":
        return "bg-green-500"
      case "Blocked":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Prepare time series data for the last 24 hours
  const getTimeSeriesData = () => {
    const now = new Date()
    const hours = []

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      const hourStart = new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours())
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

      const eventsInHour = threatEvents.filter((event) => event.timestamp >= hourStart && event.timestamp < hourEnd)

      hours.push({
        time: hourStart.getHours().toString().padStart(2, "0") + ":00",
        threats: eventsInHour.length,
        critical: eventsInHour.filter((e) => e.severity === "Critical").length,
        high: eventsInHour.filter((e) => e.severity === "High").length,
        medium: eventsInHour.filter((e) => e.severity === "Medium").length,
        low: eventsInHour.filter((e) => e.severity === "Low").length,
      })
    }

    return hours
  }

  // Prepare threat type distribution
  const getThreatTypeData = () => {
    const types = ["Malware", "DoS", "Spoofing", "Access Violation", "Port Scan", "Brute Force"]
    return types.map((type) => ({
      name: type,
      value: threatEvents.filter((event) => event.type === type).length,
      color: getSeverityColor(["Critical", "High", "Medium", "Low"][Math.floor(Math.random() * 4)]),
    }))
  }

  // Prepare severity distribution
  const getSeverityData = () => {
    const severities = ["Critical", "High", "Medium", "Low"]
    return severities.map((severity) => ({
      name: severity,
      value: threatEvents.filter((event) => event.severity === severity).length,
      color: getSeverityColor(severity),
    }))
  }

  const timeSeriesData = getTimeSeriesData()
  const threatTypeData = getThreatTypeData()
  const severityData = getSeverityData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Threat Overview</h2>
          <p className="text-gray-400">Real-time security threat monitoring and analysis</p>
        </div>
        <Button
          onClick={onExport}
          variant="outline"
          size="sm"
          className="text-purple-400 border-purple-400 hover:bg-purple-400/10 bg-transparent"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Threats
        </Button>
      </div>

      {/* Threat Timeline */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-400" />
            Threat Activity Timeline (24 Hours)
          </CardTitle>
          <CardDescription className="text-gray-400">Hourly breakdown of security threats by severity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} name="Critical" />
              <Line type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} name="High" />
              <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={2} name="Medium" />
              <Line type="monotone" dataKey="low" stroke="#22c55e" strokeWidth={2} name="Low" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Type Distribution */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-orange-400" />
              Threat Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={threatTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {threatTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Severity Distribution */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
              Severity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" fill="#8884d8">
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Threats Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Threat Events</CardTitle>
          <CardDescription className="text-gray-400">Latest security threats detected in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-300">Time</th>
                  <th className="text-left py-2 text-gray-300">Type</th>
                  <th className="text-left py-2 text-gray-300">Severity</th>
                  <th className="text-left py-2 text-gray-300">Target</th>
                  <th className="text-left py-2 text-gray-300">Source IP</th>
                  <th className="text-left py-2 text-gray-300">Status</th>
                  <th className="text-left py-2 text-gray-300">Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {threatEvents.slice(0, 10).map((event) => (
                  <tr key={event.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-2 text-gray-300">{event.timestamp.toLocaleTimeString()}</td>
                    <td className="py-2 text-gray-300">{event.type}</td>
                    <td className="py-2">
                      <Badge className={`${getSeverityColor(event.severity)} text-white`}>{event.severity}</Badge>
                    </td>
                    <td className="py-2 text-gray-300">{event.targetDevice}</td>
                    <td className="py-2 text-gray-300 font-mono text-xs">{event.sourceIP}</td>
                    <td className="py-2">
                      <Badge className={`${getStatusColor(event.status)} text-white`}>{event.status}</Badge>
                    </td>
                    <td className="py-2 text-gray-300 font-bold">{event.riskScore}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ThreatOverview
