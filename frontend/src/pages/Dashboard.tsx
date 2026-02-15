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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Mock audit log data
const auditLogs = [
  {
    id: 1,
    action: "login",
    user: "John Doe",
    details: "User logged in",
    timestamp: "2026-02-15 14:30:15",
    ip: null
  },
  {
    id: 2,
    action: "create",
    user: "John Doe",
    details: "Added IP 10.0.0.5 with label 'Development Server'",
    timestamp: "2026-02-15 14:32:45",
    ip: "10.0.0.5"
  },
  {
    id: 3,
    action: "update",
    user: "Jane Smith",
    details: "Updated label for IP 192.168.1.20 from 'DB Server' to 'Database Server'",
    timestamp: "2026-02-15 13:15:22",
    ip: "192.168.1.20"
  },
  {
    id: 4,
    action: "delete",
    user: "Admin User",
    details: "Deleted IP 172.16.0.10 with label 'Old Server'",
    timestamp: "2026-02-15 12:05:10",
    ip: "172.16.0.10"
  },
  {
    id: 5,
    action: "logout",
    user: "Mike Johnson",
    details: "User logged out",
    timestamp: "2026-02-15 11:45:30",
    ip: null
  },
  {
    id: 6,
    action: "create",
    user: "Mike Johnson",
    details: "Added IP 192.168.1.30 with label 'Backup Server'",
    timestamp: "2026-02-15 11:20:18",
    ip: "192.168.1.30"
  },
  {
    id: 7,
    action: "login",
    user: "Mike Johnson",
    details: "User logged in",
    timestamp: "2026-02-15 11:18:05",
    ip: null
  },
  {
    id: 8,
    action: "update",
    user: "John Doe",
    details: "Updated label for IP 192.168.1.10",
    timestamp: "2026-02-15 10:30:42",
    ip: "192.168.1.10"
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            {currentUser.role === "super-admin" ? (
              <RiShieldUserLine className="h-4 w-4 text-muted-foreground" />
            ) : (
              <RiUserLine className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{currentUser.role.replace("-", " ")}</div>
            <p className="text-xs text-muted-foreground">
              {currentUser.role === "super-admin" ? "Full system access" : "Limited access"}
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
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Activities</TabsTrigger>
              <TabsTrigger value="ip-changes">IP Changes</TabsTrigger>
              <TabsTrigger value="auth">Authentication</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {getActionIcon(log.action)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadge(log.action)} className="capitalize">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell className="max-w-[300px]">{log.details}</TableCell>
                      <TableCell>
                        {log.ip ? (
                          <code className="text-xs bg-muted px-2 py-1 rounded">{log.ip}</code>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {log.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="ip-changes" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.filter(log => ["create", "update", "delete"].includes(log.action)).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {getActionIcon(log.action)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadge(log.action)} className="capitalize">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell className="max-w-[300px]">{log.details}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{log.ip}</code>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {log.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="auth" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.filter(log => ["login", "logout"].includes(log.action)).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {getActionIcon(log.action)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadge(log.action)} className="capitalize">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {log.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
