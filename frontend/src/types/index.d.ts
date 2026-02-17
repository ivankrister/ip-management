export interface JsonApiIdentifier {
  type: string
  id: string
}
export type IncludedMap = Record<string, unknown | null>


export interface JsonApiResource<TAttr, TRel = unknown, TIncluded = IncludedMap> {
  type: string
  id: string
  attributes: TAttr
  relationships?: TRel
  included?: TIncluded
  links?: {
    self?: string
  }
}


export interface JsonApiCollectionResponse<T> {
  data: T[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    per_page: number
    to: number | null
    total: number
  }
}

export interface IpAddress{
  value: string
  label: string | null
  comment: string | null
  created_by: number
  createdAt: string
  updatedAt: string
}

export interface IpAddressResource {
  type: string
  id: string
  attributes: IpAddress
  relationships?: {
    createdBy: {
      data: {
        type: string
        id: string
      }
    }
  }
  included?: {
    createdBy: User
  }
  links?: {
    self: string
  }
}

export interface User {
  name: string
  email: string
  type: string
}

