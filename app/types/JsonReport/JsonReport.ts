import type { Finding } from "./Finding/Finding";
import type { JsonReportStatus } from "./JsonReportStatus";

export interface JsonReport {
    status: JsonReportStatus;
    findings: Finding[];
}
