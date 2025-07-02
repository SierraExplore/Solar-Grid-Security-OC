"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Plus, Lock, User, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import type { Incident, ThreatEvent } from "../types/security"

interface IncidentManagementProps {
  incidents: Incident[]
  threatEvents: ThreatEvent[]
  onExport: () => void
}

const IncidentManagement: React.FC<IncidentManagementProps> = ({ incidents, threatEvents, onExport }) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "Medium" as const,
    assignee: "SOC Analyst 1",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-500"
      case "In Progress":
        return "bg-yellow-500"
      case "Resolved":
        return "bg-green-500"
      case "Closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <AlertTriangle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />
      case "Closed":
        return <XCircle className="h-4 w-4" />
      default:
        return <Lock className="h-4 w-4" />
    }
  }

  const getIncidentStats = () => {
    return {
      open: incidents.filter((i) => i.status === "Open").length,
      inProgress: incidents.filter((i) => i.status === "In Progress").length,
      resolved: incidents.filter((i) => i.status === "Resolved").length,
      closed: incidents.filter((i) => i.status === "Closed").length,
      critical: incidents.filter((i) => i.severity === "Critical").length,
    }
  }

  const getRecentIncidents = () => {
    return incidents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10)
  }

  const handleCreateIncident = () => {
    // In a real application, this would make an API call
    console.log("Creating incident:", newIncident)
    setIsCreateDialogOpen(false)
    setNewIncident({
      title: "",
      description: "",
      severity: "Medium",
      assignee: "SOC Analyst 1",
    })
  }

  const stats = getIncidentStats()
  const recentIncidents = getRecentIncidents()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Incident Management</h2>
          <p className="text-gray-400">Security incident tracking and response workflow</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-green-400 border-green-400 hover:bg-green-400/10 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Create New Incident</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a new security incident for tracking and response
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Title</label>
                  <Input
                    value={newIncident.title}
                    onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                    placeholder="Incident title"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Description</label>
                  <Textarea
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                    placeholder="Incident description"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Severity</label>
                    <Select
                      value={newIncident.severity}
                      onValueChange={(value: any) => setNewIncident({ ...newIncident, severity: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Assignee</label>
                    <Select
                      value={newIncident.assignee}
                      onValueChange={(value) => setNewIncident({ ...newIncident, assignee: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="SOC Analyst 1">SOC Analyst 1</SelectItem>
                        <SelectItem value="SOC Analyst 2">SOC Analyst 2</SelectItem>
                        <SelectItem value="Security Engineer">Security Engineer</SelectItem>
                        <SelectItem value="Incident Commander">Incident Commander</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="text-gray-400 border-gray-400 hover:bg-gray-400/10"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateIncident} className="bg-green-600 hover:bg-green-700 text-white">
                    Create Incident
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            onClick={onExport}
            variant="outline"
            size="sm"
            className="text-indigo-400 border-indigo-400 hover:bg-indigo-400/10 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Incidents
          </Button>
        </div>
      </div>

      {/* Incident Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Open</p>
                <p className="text-2xl font-bold text-red-400">{stats.open}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Closed</p>
                <p className="text-2xl font-bold text-gray-400">{stats.closed}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Critical</p>
                <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
              </div>
              <Lock className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Incidents</CardTitle>
          <CardDescription className="text-gray-400">
            Latest security incidents and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer"
                onClick={() => setSelectedIncident(incident)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={`${getSeverityColor(incident.severity)} text-white text-xs`}>
                        {incident.severity}
                      </Badge>
                      <Badge className={`${getStatusColor(incident.status)} text-white text-xs flex items-center`}>
                        {getStatusIcon(incident.status)}
                        <span className="ml-1">{incident.status}</span>
                      </Badge>
                    </div>
                    <h3 className="font-medium text-white mb-1">{incident.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{incident.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {incident.assignee}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {incident.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                {incident.actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="text-xs text-gray-400 mb-1">Recent Actions:</div>
                    <div className="text-sm text-gray-300">{incident.actions[incident.actions.length - 1]}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Incident Details Dialog */}
      {selectedIncident && (
        <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>{selectedIncident.title}</span>
                <Badge className={`${getSeverityColor(selectedIncident.severity)} text-white`}>
                  {selectedIncident.severity}
                </Badge>
                <Badge className={`${getStatusColor(selectedIncident.status)} text-white flex items-center`}>
                  {getStatusIcon(selectedIncident.status)}
                  <span className="ml-1">{selectedIncident.status}</span>
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-gray-400">Incident ID: {selectedIncident.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-white mb-2">Description</h4>
                <p className="text-gray-300">{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Assignee</h4>
                  <p className="text-gray-300">{selectedIncident.assignee}</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Created</h4>
                  <p className="text-gray-300">{selectedIncident.createdAt.toLocaleString()}</p>
                </div>
              </div>

              {selectedIncident.actions.length > 0 && (
                <div>
                  <h4 className="font-medium text-white mb-2">Action History</h4>
                  <div className="space-y-2">
                    {selectedIncident.actions.map((action, index) => (
                      <div key={index} className="p-2 bg-gray-700 rounded text-sm text-gray-300">
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedIncident(null)}
                  className="text-gray-400 border-gray-400 hover:bg-gray-400/10"
                >
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Incident</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* All Incidents Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Incidents</CardTitle>
          <CardDescription className="text-gray-400">Complete incident management overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-300">ID</th>
                  <th className="text-left py-2 text-gray-300">Title</th>
                  <th className="text-left py-2 text-gray-300">Severity</th>
                  <th className="text-left py-2 text-gray-300">Status</th>
                  <th className="text-left py-2 text-gray-300">Assignee</th>
                  <th className="text-left py-2 text-gray-300">Created</th>
                  <th className="text-left py-2 text-gray-300">Updated</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <td className="py-2 text-gray-300 font-mono text-xs">{incident.id.split("-")[0]}...</td>
                    <td className="py-2 text-white font-medium max-w-xs truncate">{incident.title}</td>
                    <td className="py-2">
                      <Badge className={`${getSeverityColor(incident.severity)} text-white`}>{incident.severity}</Badge>
                    </td>
                    <td className="py-2">
                      <Badge className={`${getStatusColor(incident.status)} text-white flex items-center w-fit`}>
                        {getStatusIcon(incident.status)}
                        <span className="ml-1">{incident.status}</span>
                      </Badge>
                    </td>
                    <td className="py-2 text-gray-300">{incident.assignee}</td>
                    <td className="py-2 text-gray-300">{incident.createdAt.toLocaleDateString()}</td>
                    <td className="py-2 text-gray-300">{incident.updatedAt.toLocaleDateString()}</td>
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

export default IncidentManagement
