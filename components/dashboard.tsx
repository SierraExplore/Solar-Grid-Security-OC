"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertTriangle, Activity, Globe, Server, Download, RefreshCw, Eye, Lock, Zap } from "lucide-react"
import { SecurityDataSimulator } from "../utils/dataSimulator"
import type { ThreatEvent, DeviceStatus, FirewallAlert, DarkWebThreat, Incident } from "../types/security"
import ThreatOverview from "./ThreatOverview"
import DeviceMonitoring from "./DeviceMonitoring"
import FirewallMonitoring from "./FirewallMonitoring"
import GeographicThreats from "./GeographicThreats"
import DarkWebIntelligence from "./DarkWebIntelligence"
import IncidentManagement from "./IncidentManagement"

const CybersecurityDashboard: React.FC = () => {
  const [simulator] = useState(() => new SecurityDataSimulator())
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>([])
  const [devices, setDevices] = useState<DeviceStatus[]>([])
  const [firewallAlerts, setFirewallAlerts] = useState<FirewallAlert[]>([])
  const [darkWebThreats, setDarkWebThreats] = useState<DarkWebThreat[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)

  const refreshData = useCallback(() => {
    setThreatEvents(simulator.getThreatEvents())
    setDevices(simulator.getDevices())
    setFirewallAlerts(simulator.getFirewallAlerts())
    setDarkWebThreats(simulator.getDarkWebThreats())
    setIncidents(simulator.getIncidents())
    setLastUpdate(new Date())
  }, [simulator])

  const simulateNewEvents = useCallback(() => {
    let hasUpdates = false

    // Generate new threat events
    const newThreat = simulator.generateNewThreatEvent()
    if (newThreat) hasUpdates = true

    // Generate new firewall alerts
    const newAlert = simulator.generateNewFirewallAlert()
    if (newAlert) hasUpdates = true

    // Always update device status
    simulator.updateDeviceStatus()
    hasUpdates = true

    // Only refresh data if there were updates
    if (hasUpdates) {
      refreshData()
    }
  }, [simulator, refreshData])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  useEffect(() => {
    if (!isAutoRefresh) return

    const interval = setInterval(() => {
      simulateNewEvents()
    }, 7000) // Refresh every 7 seconds

    return () => clearInterval(interval)
  }, [isAutoRefresh, simulateNewEvents])

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

  const getSeverityCount = (severity: string) => {
    return threatEvents.filter((event) => event.severity === severity).length
  }

  const getActiveThreatsCount = () => {
    return threatEvents.filter((event) => event.status === "Active").length
  }

  const getDeviceStatusCount = (status: string) => {
    return devices.filter((device) => device.status === status).length
  }

  const handleExport = (type: "threats" | "devices" | "firewall" | "darkweb" | "incidents" | "all") => {
    simulator.exportData(type)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-yellow-400" />
              <h1 className="text-3xl font-bold">Solar Grid Security Operations Center</h1>
            </div>
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Activity className="h-4 w-4 mr-1" />
              OPERATIONAL
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">Last Update: {lastUpdate.toLocaleTimeString()}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={
                isAutoRefresh
                  ? "text-green-400 border-green-400 hover:bg-green-400/10"
                  : "text-gray-400 border-gray-400 hover:bg-gray-400/10"
              }
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isAutoRefresh ? "animate-spin" : ""}`} />
              Auto Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-400 border-blue-400 hover:bg-blue-400/10 bg-transparent"
              onClick={() => handleExport("all")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{getActiveThreatsCount()}</div>
              <p className="text-xs text-gray-400">
                {getSeverityCount("Critical")} Critical, {getSeverityCount("High")} High
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Device Status</CardTitle>
              <Server className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{getDeviceStatusCount("Online")}</div>
              <p className="text-xs text-gray-400">
                {getDeviceStatusCount("Warning")} Warning, {getDeviceStatusCount("Critical")} Critical
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Firewall Blocks</CardTitle>
              <Shield className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">
                {firewallAlerts.filter((alert) => alert.action === "BLOCK").length}
              </div>
              <p className="text-xs text-gray-400">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Dark Web Intel</CardTitle>
              <Eye className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{darkWebThreats.length}</div>
              <p className="text-xs text-gray-400">
                {darkWebThreats.filter((threat) => threat.severity === "Critical").length} Critical alerts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {threatEvents.filter((event) => event.severity === "Critical" && event.status === "Active").length > 0 && (
          <Alert className="mb-6 border-red-500 bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-400">Critical Security Alert</AlertTitle>
            <AlertDescription className="text-red-300">
              {threatEvents.filter((event) => event.severity === "Critical" && event.status === "Active").length}{" "}
              critical threats require immediate attention.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-gray-700">
              <Server className="h-4 w-4 mr-2" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="firewall" className="data-[state=active]:bg-gray-700">
              <Shield className="h-4 w-4 mr-2" />
              Firewall
            </TabsTrigger>
            <TabsTrigger value="geographic" className="data-[state=active]:bg-gray-700">
              <Globe className="h-4 w-4 mr-2" />
              Geographic
            </TabsTrigger>
            <TabsTrigger value="darkweb" className="data-[state=active]:bg-gray-700">
              <Eye className="h-4 w-4 mr-2" />
              Dark Web
            </TabsTrigger>
            <TabsTrigger value="incidents" className="data-[state=active]:bg-gray-700">
              <Lock className="h-4 w-4 mr-2" />
              Incidents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ThreatOverview threatEvents={threatEvents} onExport={() => handleExport("threats")} />
          </TabsContent>

          <TabsContent value="devices">
            <DeviceMonitoring devices={devices} onExport={() => handleExport("devices")} />
          </TabsContent>

          <TabsContent value="firewall">
            <FirewallMonitoring firewallAlerts={firewallAlerts} onExport={() => handleExport("firewall")} />
          </TabsContent>

          <TabsContent value="geographic">
            <GeographicThreats threatEvents={threatEvents} />
          </TabsContent>

          <TabsContent value="darkweb">
            <DarkWebIntelligence darkWebThreats={darkWebThreats} onExport={() => handleExport("darkweb")} />
          </TabsContent>

          <TabsContent value="incidents">
            <IncidentManagement
              incidents={incidents}
              threatEvents={threatEvents}
              onExport={() => handleExport("incidents")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CybersecurityDashboard
