import apiClient from '@/lib/axios'
import type { AuditLogResource, JsonApiCollectionResponse } from '@/types'

interface AuditLogQueryParams {
  page?: number
  per_page?: number
  sort?: string
  [key: string]: any 
}

export const auditLogService = {
  /**
   * Fetch list of audit logs
   */
  async getAll(params?: AuditLogQueryParams): Promise<JsonApiCollectionResponse<AuditLogResource>> {
    const response = await apiClient.get('/audit-logs', { params })
    return response.data
  },

  /**
   * Fetch a single audit log by ID
   */
  async getById(id: string): Promise<{ data: AuditLogResource }> {
    const response = await apiClient.get(`/audit-logs/${id}`)
    return response.data
  }
}