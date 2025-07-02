"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Eye, AlertTriangle, Shield, Database, Bug, Target } from "lucide-react"
import type { DarkWebThreat } from "../types/security"

interface DarkWebIntelligenceProps {
  darkWebThreats: DarkWebThreat[]
  onExport: () => void
}

const DarkWebIntelligence: React.FC<DarkWebIntelligenceProps> = ({ darkWebThreats, onExport }) => {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Credential Dump":
        return <Database className="h-4 w-4" />
      case "Exploit Kit":
        return <Bug className="h-4 w-4" />
      case "Targeted Campaign":
        return <Target className="h-4 w-4" />
      case "Malware Sample":
        return <Shield className="h-4 w-4" />
      case "Vulnerability Intel":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Credential Dump":
        return "text-red-400"
      case "Exploit Kit":
        return "text-orange-400"
      case "Targeted Campaign":
        return "text-purple-400"
      case "Malware Sample":
        return "text-yellow-400"
      case "Vulnerability Intel":
        return "text-blue-400"
      default:
        return "text-gray-400"
    }
  }

  // Get threat type distribution
  const getThreatTypeStats = () => {
    const types = ["Credential Dump", "Exploit Kit", "Targeted Campaign", "Malware Sample", "Vulnerability Intel"]
    return types.map((type) => ({
      type,
      count: darkWebThreats.filter((threat) => threat.type === type).length,
      critical: darkWebThreats.filter((threat) => threat.type === type && threat.severity === "Critical").length,
    }))
  }

  // Get recent critical threats
  const getCriticalThreats = () => {
    return darkWebThreats
      .filter((threat) => threat.severity === "Critical")
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5)
  }

  // Get source distribution
  const getSourceStats = () => {
    const sources = darkWebThreats.reduce(
      (acc, threat) => {
        acc[threat.source] = (acc[threat.source] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(sources)
      .sort(([, a], [, b]) => b - a)
      .map(([source, count]) => ({ source, count }))
  }

  const threatTypeStats = getThreatTypeStats()
  const criticalThreats = getCriticalThreats()
  const sourceStats = getSourceStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Dark Web Intelligence</h2>
          <p className="text-gray-400">Threat intelligence from underground sources and marketplaces</p>
        </div>
        <Button
          onClick={onExport}
          variant="outline"
          size="sm"
          className="text-pink-400 border-pink-400 hover:bg-pink-400/10 bg-transparent"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Intel
        </Button>
      </div>

      {/* Critical Alerts */}
      {criticalThreats.length > 0 && (
        <Alert className="border-red-500 bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-red-400">Critical Dark Web Intelligence</AlertTitle>
          <AlertDescription className="text-red-300">
            {criticalThreats.length} critical threats detected from dark web sources. Immediate review recommended.
          </AlertDescription>
        </Alert>
      )}

      {/* Threat Type Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {threatTypeStats.map((stat) => (
          <Card key={stat.type} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={getTypeColor(stat.type)}>{getTypeIcon(stat.type)}</div>
                <span className="text-2xl font-bold text-white">{stat.count}</span>
              </div>
              <div className="text-sm text-gray-300 mb-1">{stat.type}</div>
              {stat.critical > 0 && <Badge className="bg-red-500 text-white text-xs">{stat.critical} Critical</Badge>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Threats */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
              Critical Intelligence Alerts
            </CardTitle>
            <CardDescription className="text-gray-400">
              High-priority threats requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalThreats.length > 0 ? (
                criticalThreats.map((threat) => (
                  <div key={threat.id} className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={getTypeColor(threat.type)}>{getTypeIcon(threat.type)}</div>
                        <span className="font-medium text-white">{threat.type}</span>
                      </div>
                      <Badge className="bg-red-500 text-white text-xs">{threat.severity}</Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{threat.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Source: {threat.source}</span>
                      <span>{threat.timestamp.toLocaleDateString()}</span>
                    </div>
                    {threat.indicators.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-red-500/30">
                        <div className="text-xs text-gray-400 mb-1">Indicators:</div>
                        <div className="flex flex-wrap gap-1">
                          {threat.indicators.slice(0, 3).map((indicator, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-red-300 border-red-500/50">
                              {indicator}
                            </Badge>
                          ))}
                          {threat.indicators.length > 3 && (
                            <Badge variant="outline" className="text-xs text-gray-400">
                              +{threat.indicators.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No critical dark web threats detected</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Sources */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="h-5 w-5 mr-2 text-blue-400" />
              Intelligence Sources
            </CardTitle>
            <CardDescription className="text-gray-400">Dark web sources and their activity levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sourceStats.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-bold text-gray-400">#{index + 1}</div>
                    <div>
                      <div className="font-medium text-white">{source.source}</div>
                      <div className="text-xs text-gray-400">Intelligence Source</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{source.count}</div>
                    <div className="text-xs text-gray-400">Reports</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Dark Web Threats */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Dark Web Intelligence</CardTitle>
          <CardDescription className="text-gray-400">Complete feed of dark web threat intelligence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-300">Date</th>
                  <th className="text-left py-2 text-gray-300">Type</th>
                  <th className="text-left py-2 text-gray-300">Severity</th>
                  <th className="text-left py-2 text-gray-300">Description</th>
                  <th className="text-left py-2 text-gray-300">Source</th>
                  <th className="text-left py-2 text-gray-300">Indicators</th>
                </tr>
              </thead>
              <tbody>
                {darkWebThreats.map((threat) => (
                  <tr key={threat.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-2 text-gray-300">{threat.timestamp.toLocaleDateString()}</td>
                    <td className="py-2">
                      <div className="flex items-center space-x-2">
                        <div className={getTypeColor(threat.type)}>{getTypeIcon(threat.type)}</div>
                        <span className="text-white">{threat.type}</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <Badge className={`${getSeverityColor(threat.severity)} text-white`}>{threat.severity}</Badge>
                    </td>
                    <td className="py-2 text-gray-300 max-w-xs truncate">{threat.description}</td>
                    <td className="py-2 text-gray-300">{threat.source}</td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-1">
                        {threat.indicators.slice(0, 2).map((indicator, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-gray-400">
                            {indicator.length > 15 ? `${indicator.substring(0, 15)}...` : indicator}
                          </Badge>
                        ))}
                        {threat.indicators.length > 2 && (
                          <Badge variant="outline" className="text-xs text-gray-400">
                            +{threat.indicators.length - 2}
                          </Badge>
                        )}
                      </div>
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

export default DarkWebIntelligence
