export enum ReportStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    DONE = "DONE",
    ERROR = "ERROR"
}

export const ReportStatusDictionary: Record<string, string> = {
    [ReportStatus.PENDING]: "в ожидании обработки",
    [ReportStatus.PROCESSING]: "обрабатывается",
    [ReportStatus.DONE]: "успешно обработан",
    [ReportStatus.ERROR]: "ошибка при обработке",
};
