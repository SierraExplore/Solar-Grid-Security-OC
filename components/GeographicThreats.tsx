"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin, AlertTriangle, TrendingUp } from "lucide-react"
import type { ThreatEvent } from "../types/security"

interface GeographicThreatsProps {
  threatEvents: ThreatEvent[]
}

const GeographicThreats: React.FC<GeographicThreatsProps> = ({ threatEvents }) => {
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

  // Get threat distribution by country
  const getThreatsByCountry = () => {
    const countryThreats = threatEvents.reduce(
      (acc, event) => {
        const country = event.location.country
        if (!acc[country]) {
          acc[country] = {
            country,
            city: event.location.city,
            total: 0,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            lat: event.location.lat,
            lng: event.location.lng,
          }
        }
        acc[country].total++
        acc[country][event.severity.toLowerCase() as keyof (typeof acc)[string]]++
        return acc
      },
      {} as Record<string, any>,
    )

    return Object.values(countryThreats).sort((a: any, b: any) => b.total - a.total)
  }

  // Get recent threats with location
  const getRecentThreatsWithLocation = () => {
    return threatEvents
      .filter((event) => event.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20)
  }

  const threatsByCountry = getThreatsByCountry()
  const recentThreats = getRecentThreatsWithLocation()

  // Enhanced world map visualization with better heatmap
  const WorldMapVisualization = () => {
    const maxThreats = Math.max(...threatsByCountry.map((country: any) => country.total))

    return (
      <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-lg p-6 min-h-[500px] overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-20 grid-rows-12 h-full w-full">
            {Array.from({ length: 240 }).map((_, i) => (
              <div
                key={i}
                className="border border-blue-500/20 animate-pulse"
                style={{ animationDelay: `${i * 0.01}s` }}
              />
            ))}
          </div>
        </div>

        {/* Threat indicators with enhanced visualization */}
        <div className="relative z-10 h-full">
          {threatsByCountry.slice(0, 10).map((country: any, index) => {
            const size = Math.max(30, (country.total / maxThreats) * 80)
            const pulseSize = size + 20
            const intensity =
              country.critical > 0 ? "critical" : country.high > 0 ? "high" : country.medium > 0 ? "medium" : "low"

            // Enhanced positioning with better spread
            const positions: Record<string, { top: string; left: string }> = {
              China: { top: "25%", left: "75%" },
              Russia: { top: "15%", left: "65%" },
              USA: { top: "35%", left: "20%" },
              Iran: { top: "35%", left: "58%" },
              "North Korea": { top: "28%", left: "78%" },
              Brazil: { top: "65%", left: "32%" },
              India: { top: "42%", left: "68%" },
            }

            const position = positions[country.country] || {
              top: `${25 + ((index * 8) % 50)}%`,
              left: `${30 + ((index * 12) % 60)}%`,
            }

            const colors = {
              critical: { bg: "bg-red-500", pulse: "bg-red-400", glow: "shadow-red-500/50" },
              high: { bg: "bg-orange-500", pulse: "bg-orange-400", glow: "shadow-orange-500/50" },
              medium: { bg: "bg-yellow-500", pulse: "bg-yellow-400", glow: "shadow-yellow-500/50" },
              low: { bg: "bg-green-500", pulse: "bg-green-400", glow: "shadow-green-500/50" },
            }

            const colorScheme = colors[intensity as keyof typeof colors]

            return (
              <div
                key={country.country}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ top: position.top, left: position.left }}
              >
                {/* Outer pulse ring */}
                <div
                  className={`absolute rounded-full ${colorScheme.pulse} opacity-30 animate-ping`}
                  style={{
                    width: `${pulseSize}px`,
                    height: `${pulseSize}px`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />

                {/* Main threat indicator */}
                <div
                  className={`rounded-full ${colorScheme.bg} ${colorScheme.glow} shadow-2xl opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-110 border-2 border-white/20`}
                  style={{ width: `${size}px`, height: `${size}px` }}
                >
                  {/* Inner glow effect */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                </div>

                {/* Enhanced tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-gray-800/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-30 border border-gray-600 shadow-xl">
                  <div className="font-bold text-white mb-1">{country.country}</div>
                  <div className="text-gray-300 mb-1">{country.city}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      Total: <span className="font-bold text-white">{country.total}</span>
                    </div>
                    <div>
                      Critical: <span className="font-bold text-red-400">{country.critical}</span>
                    </div>
                    <div>
                      High: <span className="font-bold text-orange-400">{country.high}</span>
                    </div>
                    <div>
                      Medium: <span className="font-bold text-yellow-400">{country.medium}</span>
                    </div>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 border-l border-t border-gray-600" />
                </div>

                {/* Threat count label */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs pointer-events-none">
                  {country.total}
                </div>
              </div>
            )
          })}
        </div>

        {/* Enhanced legend with better styling */}
        <div className="absolute bottom-6 left-6 bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl border border-gray-600 shadow-2xl">
          <div className="text-white text-sm font-bold mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-400" />
            Threat Intensity Scale
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
              <span className="text-gray-300">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"></div>
              <span className="text-gray-300">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
              <span className="text-gray-300">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
              <span className="text-gray-300">Low</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-400">Circle size = threat volume</div>
        </div>

        {/* Real-time indicator */}
        <div className="absolute top-6 right-6 bg-green-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          LIVE
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Geographic Threat Analysis</h2>
          <p className="text-gray-400">Global threat distribution and attack source mapping</p>
        </div>
      </div>

      {/* Enhanced World Map Visualization */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-400" />
            Global Threat Heatmap
          </CardTitle>
          <CardDescription className="text-gray-400">
            Real-time visualization of threat sources worldwide with intensity mapping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorldMapVisualization />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Threat Countries with enhanced styling */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-400" />
              Top Threat Sources
            </CardTitle>
            <CardDescription className="text-gray-400">Countries with highest threat activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {threatsByCountry.slice(0, 8).map((country: any, index) => (
                <div
                  key={country.country}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700 to-gray-700/50 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-white">{country.country}</div>
                      <div className="text-sm text-gray-400">{country.city}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{country.total}</div>
                    <div className="flex space-x-1 mt-1">
                      {country.critical > 0 && (
                        <Badge className="bg-red-500 text-white text-xs px-2">{country.critical}C</Badge>
                      )}
                      {country.high > 0 && (
                        <Badge className="bg-orange-500 text-white text-xs px-2">{country.high}H</Badge>
                      )}
                      {country.medium > 0 && (
                        <Badge className="bg-yellow-500 text-white text-xs px-2">{country.medium}M</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Geographic Threats with enhanced styling */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
              Recent Threats by Location
            </CardTitle>
            <CardDescription className="text-gray-400">Latest threats with geographic information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentThreats.map((threat) => (
                <div
                  key={threat.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-700 to-gray-700/30 rounded-lg hover:from-gray-600 hover:to-gray-600/30 transition-all duration-300 border border-gray-600/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={`${getSeverityColor(threat.severity)} text-white text-xs`}>
                        {threat.severity}
                      </Badge>
                      <span className="text-white font-medium">{threat.type}</span>
                    </div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {threat.location.city}, {threat.location.country}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {threat.sourceIP} → {threat.targetDevice}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">{threat.timestamp.toLocaleTimeString()}</div>
                    <div className="text-xs text-gray-500">Risk: {threat.riskScore}/10</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Statistics with enhanced table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Geographic Statistics</CardTitle>
          <CardDescription className="text-gray-400">
            Detailed breakdown of threats by region and severity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-gray-300 font-semibold">Country</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">City</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">Total Threats</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">Critical</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">High</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">Medium</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">Low</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {threatsByCountry.map((country: any) => {
                  const riskLevel =
                    country.critical > 0
                      ? "Critical"
                      : country.high > 0
                        ? "High"
                        : country.medium > 0
                          ? "Medium"
                          : "Low"

                  return (
                    <tr
                      key={country.country}
                      className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="py-3 text-white font-medium">{country.country}</td>
                      <td className="py-3 text-gray-300">{country.city}</td>
                      <td className="py-3 text-white font-bold">{country.total}</td>
                      <td className="py-3 text-red-400 font-medium">{country.critical}</td>
                      <td className="py-3 text-orange-400 font-medium">{country.high}</td>
                      <td className="py-3 text-yellow-400 font-medium">{country.medium}</td>
                      <td className="py-3 text-green-400 font-medium">{country.low}</td>
                      <td className="py-3">
                        <Badge className={`${getSeverityColor(riskLevel)} text-white`}>{riskLevel}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GeographicThreats
