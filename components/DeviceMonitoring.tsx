"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Server, Wifi, WifiOff, AlertTriangle, CheckCircle } from "lucide-react"
import type { DeviceStatus } from "../types/security"

interface DeviceMonitoringProps {
  devices: DeviceStatus[]
  onExport: () => void
}

const DeviceMonitoring: React.FC<DeviceMonitoringProps> = ({ devices, onExport }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-500"
      case "Warning":
        return "bg-yellow-500"
      case "Critical":
        return "bg-red-500"
      case "Offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Online":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "Warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "Critical":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "Offline":
        return <WifiOff className="h-4 w-4 text-gray-400" />
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />
    }
  }

  const getDeviceTypeIcon = (type: string) => {
    // You could expand this with more specific icons
    return <Server className="h-5 w-5 text-blue-400" />
  }

  const getStatusStats = () => {
    const stats = {
      Online: devices.filter((d) => d.status === "Online").length,
      Warning: devices.filter((d) => d.status === "Warning").length,
      Critical: devices.filter((d) => d.status === "Critical").length,
      Offline: devices.filter((d) => d.status === "Offline").length,
    }
    return stats
  }

  const getHighRiskDevices = () => {
    return devices.filter(
      (device) => device.status === "Critical" || device.failedLogins > 5 || device.status === "Offline",
    )
  }

  const statusStats = getStatusStats()
  const highRiskDevices = getHighRiskDevices()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Device Monitoring</h2>
          <p className="text-gray-400">Smart grid infrastructure device status and authentication monitoring</p>
        </div>
        <Button
          onClick={onExport}
          variant="outline"
          size="sm"
          className="text-cyan-400 border-cyan-400 hover:bg-cyan-400/10 bg-transparent"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Devices
        </Button>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Online</p>
                <p className="text-2xl font-bold text-green-400">{statusStats.Online}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Warning</p>
                <p className="text-2xl font-bold text-yellow-400">{statusStats.Warning}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Critical</p>
                <p className="text-2xl font-bold text-red-400">{statusStats.Critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Offline</p>
                <p className="text-2xl font-bold text-gray-400">{statusStats.Offline}</p>
              </div>
              <WifiOff className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Devices Alert */}
      {highRiskDevices.length > 0 && (
        <Card className="bg-red-900/20 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              High Risk Devices ({highRiskDevices.length})
            </CardTitle>
            <CardDescription className="text-red-300">
              Devices requiring immediate attention due to critical status or security concerns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highRiskDevices.slice(0, 6).map((device) => (
                <div key={device.id} className="bg-gray-800 p-4 rounded-lg border border-red-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getDeviceTypeIcon(device.type)}
                      <span className="font-medium text-white">{device.name}</span>
                    </div>
                    {getStatusIcon(device.status)}
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{device.type}</p>
                  <p className="text-sm text-gray-400 mb-2">{device.location}</p>
                  {device.failedLogins > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {device.failedLogins} Failed Logins
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device Grid */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Devices</CardTitle>
          <CardDescription className="text-gray-400">
            Complete overview of smart grid infrastructure devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getDeviceTypeIcon(device.type)}
                    <span className="font-medium text-white">{device.name}</span>
                  </div>
                  <Badge className={`${getStatusColor(device.status)} text-white text-xs`}>{device.status}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white">{device.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{device.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IP:</span>
                    <span className="text-white font-mono text-xs">{device.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Seen:</span>
                    <span className="text-white">{device.lastSeen.toLocaleTimeString()}</span>
                  </div>

                  {device.authAttempts > 0 && (
                    <div className="pt-2 border-t border-gray-600">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auth Attempts:</span>
                        <span className="text-white">{device.authAttempts}</span>
                      </div>
                      {device.failedLogins > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Failed Logins:</span>
                          <span className="text-red-400 font-medium">{device.failedLogins}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Types Summary */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Device Types Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from(new Set(devices.map((d) => d.type))).map((type) => {
              const typeDevices = devices.filter((d) => d.type === type)
              const onlineCount = typeDevices.filter((d) => d.status === "Online").length
              const totalCount = typeDevices.length

              return (
                <div key={type} className="text-center p-4 bg-gray-700 rounded-lg">
                  {getDeviceTypeIcon(type)}
                  <h3 className="text-white font-medium mt-2 text-sm">{type}</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {onlineCount}/{totalCount} Online
                  </p>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(onlineCount / totalCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeviceMonitoring
