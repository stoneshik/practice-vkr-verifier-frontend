export enum JsonReportStatus {
    COMPLETED = "completed",
    COMPLETED_WITH_FINDINGS = "completed_with_findings",
    ERROR = "error",
}

export const JsonReportStatusDictionary: Record<string, string> = {
    [JsonReportStatus.COMPLETED]: "ошибок и предупреждений нет",
    [JsonReportStatus.COMPLETED_WITH_FINDINGS]: "есть ошибки или предупреждения",
    [JsonReportStatus.ERROR]: "произошла ошибка при обработке файла",
};
