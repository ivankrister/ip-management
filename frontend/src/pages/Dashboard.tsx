import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  RiGlobalLine,
  RiUserLine,
  RiShieldUserLine,
  RiHistoryLine,
  RiArrowRightLine,
  RiFileListLine,
  RiAddCircleLine,
  RiEditLine,
  RiDeleteBinLine,
  RiLoginCircleLine,
  RiLogoutCircleLine
} from "@remixicon/react";
import { useEffect, useState } from "react";
import { auditLogService } from "@/services/audit.service";
import type { AuditLogResource } from "@/types";

// Mock user role - change this to your actual auth context
const currentUser = {
  role: "super-admin", // or "user"
  id: 1,
  name: "John Doe"
};

// Mock chart data for IP registrations
const chartData = [
  { date: "Feb 09", count: 12 },
  { date: "Feb 10", count: 15 },
  { date: "Feb 11", count: 18 },
  { date: "Feb 12", count: 14 },
  { date: "Feb 13", count: 22 },
  { date: "Feb 14", count: 19 },
  { date: "Feb 15", count: 25 },
];

const chartConfig = {
  count: {
    label: "IP Addresses",
    color: "hsl(var(--primary))",
  },
};

// Mock data for recent IP additions
const recentIPs = [
  { 
    id: 1, 
    ip: "10.0.0.5", 
    label: "Development Server", 
    type: "IPv4",
    addedBy: "John Doe",
    time: "2 hours ago"
  },
  { 
    id: 2, 
    ip: "192.168.1.30", 
    label: "Backup Server", 
    type: "IPv4",
    addedBy: "Mike Johnson",
    time: "5 hours ago"
  },
  { 
    id: 3, 
    ip: "2001:0db8:85a3::7334", 
    label: "Mail Server", 
    type: "IPv6",
    addedBy: "John Doe",
    time: "1 day ago"
  },
];



const getActionIcon = (action: string) => {
  switch (action) {
    case "create":
      return <RiAddCircleLine className="h-4 w-4 text-green-600" />;
    case "update":
      return <RiEditLine className="h-4 w-4 text-blue-600" />;
    case "delete":
      return <RiDeleteBinLine className="h-4 w-4 text-red-600" />;
    case "login":
      return <RiLoginCircleLine className="h-4 w-4 text-purple-600" />;
    case "logout":
      return <RiLogoutCircleLine className="h-4 w-4 text-gray-600" />;
    default:
      return <RiFileListLine className="h-4 w-4" />;
  }
};

const getActionBadge = (action: string) => {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    create: "default",
    update: "secondary",
    delete: "outline",
    login: "secondary",
    logout: "outline",
  };
  return variants[action] || "outline";
};

export default function Dashboard() {
  const [auditLogs, setAuditLogs] = useState<AuditLogResource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    auditLogService.getAll({page: 1, sort: "-created_at" })
      .then(data => {
        setAuditLogs(data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching audit logs:", error);
        setLoading(false);
      });
  }, []);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {currentUser.name}! Here's your system overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total IP Addresses</CardTitle>
            <RiGlobalLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +12 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPv4 Addresses</CardTitle>
            <RiGlobalLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <p className="text-xs text-muted-foreground">
              77% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPv6 Addresses</CardTitle>
            <RiGlobalLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">29</div>
            <p className="text-xs text-muted-foreground">
              23% of total
            </p>
          </CardContent>
        </Card>

        
      </div>

      {/* Chart and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* IP Registration Trend */}
        <Card>
          <CardHeader>
            <CardTitle>IP Registration Trend</CardTitle>
            <CardDescription>
              Number of IP addresses added over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  fill="var(--color-count)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent IP Additions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent IP Additions</CardTitle>
              <CardDescription>Latest IP addresses added to the system</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
              <RiArrowRightLine className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIPs.map((ip) => (
                <div key={ip.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <RiGlobalLine className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium font-mono">{ip.ip}</p>
                      <p className="text-xs text-muted-foreground">{ip.label}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={ip.type === "IPv4" ? "default" : "secondary"} className="mb-1">
                      {ip.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{ip.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RiHistoryLine className="h-5 w-5" />
              Audit Logs
            </CardTitle>
            <CardDescription>
              Real-time tracking of all system activities and changes
            </CardDescription>
          </div>
          {currentUser.role === "super-admin" && (
            <Button variant="outline">
              <RiFileListLine className="mr-2 h-4 w-4" />
              Full Audit Dashboard
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log: AuditLogResource) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {getActionIcon(log.attributes.type)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadge(log.attributes.type)} className="capitalize">
                          {log.attributes.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.included?.user.email}</TableCell>
                      <TableCell className="max-w-[300px] whitespace-normal">{log.attributes.details}</TableCell>
                      <TableCell>
                        {log.attributes.ip_address !== '-' ? (
                          <code className="text-xs bg-muted px-2 py-1 rounded">{log.attributes.ip_address}</code>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {log.attributes.createdAt}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        </CardContent>
      </Card>
    </div>
  );
}
