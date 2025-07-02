"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Download, Shield, BlocksIcon as Block, CheckCircle, X } from "lucide-react"
import type { FirewallAlert } from "../types/security"

interface FirewallMonitoringProps {
  firewallAlerts: FirewallAlert[]
  onExport: () => void
}

const FirewallMonitoring: React.FC<FirewallMonitoringProps> = ({ firewallAlerts, onExport }) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case "BLOCK":
        return "bg-red-500"
      case "DROP":
        return "bg-orange-500"
      case "ALLOW":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "BLOCK":
        return <Block className="h-4 w-4" />
      case "DROP":
        return <X className="h-4 w-4" />
      case "ALLOW":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get firewall activity over time
  const getTimeSeriesData = () => {
    const now = new Date()
    const hours = []

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      const hourStart = new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours())
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

      const alertsInHour = firewallAlerts.filter((alert) => alert.timestamp >= hourStart && alert.timestamp < hourEnd)

      hours.push({
        time: hourStart.getHours().toString().padStart(2, "0") + ":00",
        total: alertsInHour.length,
        blocked: alertsInHour.filter((a) => a.action === "BLOCK").length,
        dropped: alertsInHour.filter((a) => a.action === "DROP").length,
        allowed: alertsInHour.filter((a) => a.action === "ALLOW").length,
      })
    }

    return hours
  }

  // Get top blocked ports
  const getTopBlockedPorts = () => {
    const blockedAlerts = firewallAlerts.filter((alert) => alert.action === "BLOCK")
    const portCounts = blockedAlerts.reduce(
      (acc, alert) => {
        acc[alert.port] = (acc[alert.port] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    return Object.entries(portCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([port, count]) => ({ port: Number.parseInt(port), count }))
  }

  // Get protocol distribution
  const getProtocolData = () => {
    const protocols = ["TCP", "UDP", "ICMP"]
    return protocols.map((protocol) => ({
      name: protocol,
      value: firewallAlerts.filter((alert) => alert.protocol === protocol).length,
    }))
  }

  const timeSeriesData = getTimeSeriesData()
  const topBlockedPorts = getTopBlockedPorts()
  const protocolData = getProtocolData()

  const actionStats = {
    BLOCK: firewallAlerts.filter((a) => a.action === "BLOCK").length,
    DROP: firewallAlerts.filter((a) => a.action === "DROP").length,
    ALLOW: firewallAlerts.filter((a) => a.action === "ALLOW").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Firewall Monitoring</h2>
          <p className="text-gray-400">Network security and firewall activity analysis</p>
        </div>
        <Button
          onClick={onExport}
          variant="outline"
          size="sm"
          className="text-orange-400 border-orange-400 hover:bg-orange-400/10 bg-transparent"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Firewall Data
        </Button>
      </div>

      {/* Action Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Blocked</p>
                <p className="text-2xl font-bold text-red-400">{actionStats.BLOCK}</p>
              </div>
              <Block className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Dropped</p>
                <p className="text-2xl font-bold text-orange-400">{actionStats.DROP}</p>
              </div>
              <X className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Allowed</p>
                <p className="text-2xl font-bold text-green-400">{actionStats.ALLOW}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Firewall Activity Timeline */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-400" />
            Firewall Activity Timeline (24 Hours)
          </CardTitle>
          <CardDescription className="text-gray-400">Hourly breakdown of firewall actions</CardDescription>
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
              <Line type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} name="Blocked" />
              <Line type="monotone" dataKey="dropped" stroke="#f97316" strokeWidth={2} name="Dropped" />
              <Line type="monotone" dataKey="allowed" stroke="#22c55e" strokeWidth={2} name="Allowed" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Blocked Ports */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Blocked Ports</CardTitle>
            <CardDescription className="text-gray-400">Most frequently blocked network ports</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topBlockedPorts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="port" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Protocol Distribution */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Protocol Distribution</CardTitle>
            <CardDescription className="text-gray-400">Network traffic by protocol type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={protocolData}>
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
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Firewall Alerts */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Firewall Alerts</CardTitle>
          <CardDescription className="text-gray-400">Latest firewall activity and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-300">Time</th>
                  <th className="text-left py-2 text-gray-300">Action</th>
                  <th className="text-left py-2 text-gray-300">Source IP</th>
                  <th className="text-left py-2 text-gray-300">Dest IP</th>
                  <th className="text-left py-2 text-gray-300">Port</th>
                  <th className="text-left py-2 text-gray-300">Protocol</th>
                  <th className="text-left py-2 text-gray-300">Rule</th>
                  <th className="text-left py-2 text-gray-300">Severity</th>
                </tr>
              </thead>
              <tbody>
                {firewallAlerts.slice(0, 15).map((alert) => (
                  <tr key={alert.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-2 text-gray-300">{alert.timestamp.toLocaleTimeString()}</td>
                    <td className="py-2">
                      <Badge className={`${getActionColor(alert.action)} text-white flex items-center w-fit`}>
                        {getActionIcon(alert.action)}
                        <span className="ml-1">{alert.action}</span>
                      </Badge>
                    </td>
                    <td className="py-2 text-gray-300 font-mono text-xs">{alert.sourceIP}</td>
                    <td className="py-2 text-gray-300 font-mono text-xs">{alert.destIP}</td>
                    <td className="py-2 text-gray-300 font-bold">{alert.port}</td>
                    <td className="py-2 text-gray-300">{alert.protocol}</td>
                    <td className="py-2 text-gray-300">{alert.rule}</td>
                    <td className="py-2">
                      <Badge className={`${getSeverityColor(alert.severity)} text-white`}>{alert.severity}</Badge>
                    </td>
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

export default FirewallMonitoring
