import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ipAddressService } from "@/services/ip-address.service"

interface CreateIpAddressFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CreateIpAddressForm({ onSuccess, onCancel }: CreateIpAddressFormProps) {
  const [value, setValue] = useState("")
  const [label, setLabel] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await ipAddressService.create({
        value,
        label: label || null,
        comment: comment || null,
      })
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create IP address")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="value">
          IP Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="value"
          type="text"
          placeholder="192.168.1.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          type="text"
          placeholder="Production Server"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          placeholder="Additional notes..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create IP Address"}
        </Button>
      </div>
    </form>
  )
}
