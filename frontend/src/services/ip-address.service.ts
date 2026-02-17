import apiClient from '@/lib/axios'
import type { IpAddressResource, JsonApiCollectionResponse } from '@/types'

interface IpAddressQueryParams {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  [key: string]: any // Allow any additional params
}

export const ipAddressService = {
  /**
   * Fetch list of IP addresses
   */
  async getAll(params?: IpAddressQueryParams): Promise<JsonApiCollectionResponse<IpAddressResource>> {
    const response = await apiClient.get('/ip-addresses', { params })
    return response.data
  },

  /**
   * Fetch a single IP address by ID
   */
  async getById(id: string): Promise<{ data: IpAddressResource }> {
    const response = await apiClient.get(`/ip-addresses/${id}`)
    return response.data
  },

  /**
   * Create a new IP address
   */
  async create(data: {
    value: string
    label?: string | null
    comment?: string | null
  }): Promise<{ data: IpAddressResource }> {
    const response = await apiClient.post('/ip-addresses', {
        data: {
            attributes: {
                value: data.value,
                label: data.label,
                comment: data.comment,
            }
        }
    })
    return response.data
  },

  /**
   * Update an existing IP address
   */
  async update(
    id: string,
    data: {
      value?: string
      label?: string | null
      comment?: string | null
    }
  ): Promise<{ data: IpAddressResource }> {
    const response = await apiClient.put(`/ip-addresses/${id}`, {
        data: {
            attributes: {
                value: data.value,
                label: data.label,
                comment: data.comment,
            }
        }
    })
    return response.data
  },

  /**
   * Delete an IP address
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/ip-addresses/${id}`)
  },
}
