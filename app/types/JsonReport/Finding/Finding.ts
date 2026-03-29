import type { FindingLocation } from "./FindingLocation";
import type { FindingRule } from "./FindingRule";
import type { FindingSeverity } from "./FindingSeverity";

export interface Finding {
    rule: FindingRule;
    severity: FindingSeverity;
    message: string | null;
    location: FindingLocation | null;
    actual: string | null;
    expected: string | null;
    recommendation: string | null;
}
