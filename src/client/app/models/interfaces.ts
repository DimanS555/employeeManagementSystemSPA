export interface Employee {
    id?: number;
    firstName: string;
    lastName: string;
    isActive: boolean;
    emp_depID: number;
}

export interface Department {
    id: number;
    depName: string;
}

export interface Pagination {
    currentPage : number;
    itemsPerPage : number;
    totalItems : number;
    totalPages: number;
}

export class PaginatedResult<T> {
    result :  T;
    pagination : Pagination;
}