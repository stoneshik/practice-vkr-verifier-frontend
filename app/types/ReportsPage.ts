import type { VerificationReport } from "./VerificationReport";

export interface ReportsPage {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    elements: VerificationReport[];
}
