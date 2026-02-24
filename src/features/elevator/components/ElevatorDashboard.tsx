import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Elevator } from "@/types"
import { Activity, AlertTriangle, CheckCircle2, Settings } from "lucide-react"

const mockElevators: Elevator[] = [
  { id: "E01", name: "Elevator 1", building: "Tower A", floorRange: "1-20", status: "available", lastUpdated: "10:32 AM" },
  { id: "E02", name: "Elevator 2", building: "Tower A", floorRange: "1-20", status: "maintenance", lastUpdated: "09:10 AM" },
  { id: "E03", name: "Elevator 3", building: "Tower B", floorRange: "1-30", status: "out_of_order", lastUpdated: "08:55 AM" },
  { id: "E04", name: "Elevator 4", building: "Tower B", floorRange: "1-30", status: "available", lastUpdated: "11:15 AM" },
]

export function ElevatorDashboard() {
  const getStatusBadge = (status: Elevator["status"]) => {
    switch (status) {
      case "available":
        return <Badge variant="success">Available</Badge>
      case "maintenance":
        return <Badge variant="warning">Maintenance</Badge>
      case "out_of_order":
        return <Badge variant="destructive">Out of Order</Badge>
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Elevator CMS</h1>
          <p className="text-muted-foreground mt-2">Real-time monitoring and status management system.</p>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="px-4 py-1 text-sm">
            <Activity className="w-4 h-4 mr-2" /> 4 Units Connected
          </Badge>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Available</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">2</div>
            <p className="text-xs text-green-600/80">Units operational</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Maintenance</CardTitle>
            <Settings className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">1</div>
            <p className="text-xs text-yellow-600/80">Scheduled checks</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/5 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Out of Order</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">1</div>
            <p className="text-xs text-red-600/80">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Elevator Status Overview</CardTitle>
          <CardDescription>Comprehensive list of all units and their current operational state.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Floors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockElevators.map((elevator) => (
                <TableRow key={elevator.id}>
                  <TableCell className="font-bold">{elevator.id}</TableCell>
                  <TableCell>{elevator.building}</TableCell>
                  <TableCell>{elevator.floorRange}</TableCell>
                  <TableCell>{getStatusBadge(elevator.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{elevator.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
