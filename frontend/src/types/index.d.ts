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
  type: string
  created_by: number
  createdAt: string
  updatedAt: string
}

export interface IpAddressStats {
  total: number
  ipv4Count: number
  ipv6Count: number
  recentIpAddresses: IpAddressResource[]
  last7Days?: {
    date: string
    count: number
  }[]
}

export interface AuditLog {
  action: string
  type: string
  details: string | null
  ip_address: string | null
  user_id: number | null
  entity_type: string | null
  entity_id: string | null
  createdAt: string
  metadata: {
    user: {
      id: number
      email: string
      name: string
      type: string
    }
  } | null
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

export interface AuditLogResource {
  type: string
  id: string
  attributes: AuditLog
  relationships?: {
    user: {
      data: {
        type: string
        id: string
      }
    }
  }
  included?: {
    user: User
  }
  links?: {
    self: string
  }
}

export interface UserResource {
  type: string
  id: string
  attributes: User
  links?: {
    self: string
  }
}

export type FailedRequest = {
  resolve: (token: string) => void
  reject: (error: Error) => void
}

export interface User {
  id: number
  name: string
  email: string
  type: string
}

