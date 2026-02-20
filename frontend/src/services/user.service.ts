import apiClient from '@/lib/axios'
import type { JsonApiCollectionResponse, User, UserResource } from '@/types'

interface QueryParams {
  search?: string
  page?: number
  per_page?: number
  sort?: string
}

export const userService = {
    /**
   * Fetch list of Users
   */
  async getAll(params?: QueryParams): Promise<JsonApiCollectionResponse<UserResource>> {
    const response = await apiClient.get('/users', { params })
    return response.data
  },

   /**
   * Create a new User
   */
  async create(data: {
    email: string
    type: string
    name: string
    password: string
  }): Promise<{ data: UserResource }> {
    const response = await apiClient.post('/users', {
        data: {
            attributes: {
                email: data.email,
                type: data.type,
                name: data.name,
                password: data.password,
            }
        }
    })
    return response.data
  },


}
   