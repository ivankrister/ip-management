import { Copy, Check, Calendar, User, Clock, MessageSquare, Tag } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { IpAddressResource } from "@/types"

interface IpAddressDetailProps {
  ipAddress: IpAddressResource
}

export function IpAddressDetail({ ipAddress }: IpAddressDetailProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ipAddress.attributes.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* IP Address Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Tag className="h-4 w-4" />
          <span>IP Address</span>
        </div>
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-start justify-between gap-3">
            <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight break-all">
              {ipAddress.attributes.value}
            </span>
            <Button
              variant={copied ? "default" : "outline"}
              size="sm"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Details Section */}
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>Label</span>
          </div>
          <div className="pl-6">
            {ipAddress.attributes.label ? (
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                {ipAddress.attributes.label}
              </Badge>
            ) : (
              <span className="text-sm text-muted-foreground italic">No label</span>
            )}
          </div>
        </div>

        {ipAddress.attributes.comment && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>Comment</span>
              </div>
              <div className="pl-6">
                <p className="text-sm leading-relaxed text-foreground">
                  {ipAddress.attributes.comment}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <Separator />

      {/* Metadata Section */}
      <div className="space-y-4">
        
        <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created By</p>
              <p className="text-base font-semibold">
                {ipAddress.included?.createdBy?.name || "Unknown"}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {formatDate(ipAddress.attributes.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Updated</p>
                <p className="text-sm font-medium">
                  {formatDate(ipAddress.attributes.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
