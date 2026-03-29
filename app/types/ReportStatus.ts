export enum ReportStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    DONE = "DONE",
    ERROR = "ERROR"
}

export const ReportStatusDictionary: Record<string, string> = {
    [ReportStatus.PENDING]: "в ожидании",
    [ReportStatus.PROCESSING]: "обрабатывается",
    [ReportStatus.DONE]: "успешно",
    [ReportStatus.ERROR]: "ошибка",
};
