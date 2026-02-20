import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  RiGlobalLine,
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
import type { AuditLogResource, IpAddressStats } from "@/types";
import { ipAddressService } from "@/services/ip-address.service";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";

const chartConfig = {
  count: {
    label: "IP Addresses",
    color: "hsl(var(--primary))",
  },
};



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
  const [loading, setLoading] = useState(true);
  const [ipStats, setIpStats] = useState<IpAddressStats>({
    total: 0,
    ipv4Count: 0,
    ipv6Count: 0,
    last7Days: [],
    recentIpAddresses: []
  });
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      ipAddressService.getStats(),
      auditLogService.getAll({ page: 1, sort: "-created_at" })
    ])
      .then(([statsData, logsData]) => {
        setIpStats(statsData.data);
        setAuditLogs(logsData.data);
      })
      .catch(error => {
        console.error("Error fetching dashboard data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your system overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total IP Addresses</CardTitle>
                <RiGlobalLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ipStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  Total number of IP addresses currently in the system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IPv4 Addresses</CardTitle>
                <RiGlobalLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ipStats.ipv4Count}</div>
                <p className="text-xs text-muted-foreground">
                  {ipStats.total > 0 ? ((ipStats.ipv4Count / ipStats.total) * 100).toFixed(0) : 0}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IPv6 Addresses</CardTitle>
                <RiGlobalLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ipStats.ipv6Count}</div>
                <p className="text-xs text-muted-foreground">
                  {ipStats.total > 0 ? ((ipStats.ipv6Count / ipStats.total) * 100).toFixed(0) : 0}% of total
                </p>
              </CardContent>
            </Card>
          </>
        )}
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
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart data={ipStats.last7Days || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            )}
          </CardContent>
        </Card>

        {/* Recent IP Additions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent IP Additions</CardTitle>
              <CardDescription>Latest IP addresses added to the system</CardDescription>
            </div>
            {!loading && ipStats.total > 3 && (
              <Link to="/ip-management">
                <Button variant="ghost" size="sm">
                  View All
                  <RiArrowRightLine className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </>
              ) : ipStats.recentIpAddresses.length > 0 ? (
                ipStats.recentIpAddresses.map((ip) => (
                  <div key={ip.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <RiGlobalLine className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium font-mono">{ip.attributes.value}</p>
                        <p className="text-xs text-muted-foreground">{ip.attributes.label}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={ip.attributes.type === "ipv4" ? "default" : "secondary"} className="mb-1">
                        {ip.attributes.type === "ipv4" ? "IPv4" : "IPv6"}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{formatDate(ip.attributes.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No recent IP addresses</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              Real-time tracking of all system activities and changes
            </CardDescription>
          </div>
          <Link to="/audit-logs">
            <Button variant="outline">
              <RiFileListLine className="mr-2 h-4 w-4" />
              Full Audit Dashboard
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ))}
            </div>
          ) : (
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
                {auditLogs.length > 0 ? (
                  auditLogs.map((log: AuditLogResource) => (
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
                        {formatDate(log.attributes.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
