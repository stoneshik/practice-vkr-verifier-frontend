import type { ReportStatus } from "./ReportStatus";

export interface VerificationReport {
    id: string;
    reportStatus: ReportStatus;
    reportJson: string | null;
    createdAt: string;
}
