import apiClient from '@/lib/axios'
import type { JsonApiCollectionResponse, UserResource } from '@/types'

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
    role: string
    name: string
    password: string
    confirmation_password: string 
  }): Promise<{ data: UserResource }> {
    const response = await apiClient.post('/users', {
        data: {
            attributes: {
                email: data.email,
                role: data.role,
                name: data.name,
                password: data.password,
                password_confirmation: data.confirmation_password,
            }
        }
    })
    return response.data
  },


}
   