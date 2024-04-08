type Result = 'SUCCESS' | 'ERROR' | 'FAIL'

// 기본 GET response data type
export interface CommonResponse<T> {
  resultCode: Result
  data: T
  message: string
}
// 페이지네이션이 적용되는 GET response data type
export interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

interface Pageable {
  pageNumber: number
  pageSize: number
  sort: Sort
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface PaginationData<T> {
  content: T
  pageable: Pageable // 현재 페이지 내의 데이터 갯수
  size: number // 한 번에 넘기는 데이터 갯수
  number: number
  sort: Sort
  numberOfElements: number // 실제로 넘어온 갯수
  first: boolean // 첫 페이지
  last: boolean // true 일 경우 마지막 페이지
  empty: boolean
}

export interface PaginationResponse<T> {
  resultCode: Result
  data: PaginationData<T>
  message: string
}