export enum FindingSeverity {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
}

export const FindingSeverityDictionary: Record<string, string> = {
    [FindingSeverity.ERROR]: "критическая ошибка (нарушение требований)",
    [FindingSeverity.WARNING]: "нежелательное отклонение",
    [FindingSeverity.INFO]: "информационное сообщение",
};
