import type { JSX } from "react";
import { FindingSeverity, FindingSeverityDictionary } from "~/types/JsonReport/Finding/FindingSeverity";
import type { JsonReport } from "~/types/JsonReport/JsonReport";
import { JsonReportStatusDictionary } from "~/types/JsonReport/JsonReportStatus";
import styles from "./ReportJsonTable.module.scss";

interface ReportJsonTableProps {
    jsonReport: JsonReport;
}

export const ReportJsonTable = ({ jsonReport }: ReportJsonTableProps): JSX.Element => {
    const getRowClassName = (severity: string): string => {
        switch (severity) {
            case FindingSeverity.ERROR:
                return styles.rowError;
            case FindingSeverity.WARNING:
                return styles.rowWarning;
            case FindingSeverity.INFO:
                return styles.rowInfo;
            default:
                return "";
        }
    };
    return (
        <>
            <h2>Резюме анализа: {JsonReportStatusDictionary[jsonReport.status]}</h2>
            {jsonReport.findings && jsonReport.findings.length > 0 && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Код правила</th>
                            <th>Уровень проблемы</th>
                            <th>Описание проблемы</th>
                            <th>Расположение</th>
                            <th>Фактическое значение</th>
                            <th>Ожидаемое значение</th>
                            <th>Рекомендация по исправлению</th>
                        </tr>
                    </thead>

                    <tbody>
                        {jsonReport.findings.map((finding, index) => (
                            <tr key={`${finding.rule}-${index}`}
                                className={getRowClassName(finding.severity)}>
                                <td>{index + 1}</td>
                                <td>
                                    <a href={`#${finding.rule}`}>
                                        {finding.rule}
                                    </a>
                                </td>
                                <td>{FindingSeverityDictionary[finding.severity]}</td>
                                <td>{finding.message ?? "-"}</td>
                                {(finding.location && (
                                    finding.location.paragraph ||
                                    finding.location.block ||
                                    finding.location.section ||
                                    finding.location.page
                                )) && (
                                    <td>
                                        Параграф: {finding.location.paragraph ?? "?"}
                                        <br />
                                        Блок: {finding.location.block ?? "?"}
                                        <br />
                                        Секция: {finding.location.section ?? "?"}
                                        <br />
                                        Страница: {finding.location.page ?? "?"}
                                    </td>
                                )}
                                {(!finding.location ||
                                    (
                                        !finding.location.paragraph &&
                                        !finding.location.block &&
                                        !finding.location.section &&
                                        !finding.location.page
                                    )) && <td>-</td>}
                                {(!finding.actual || finding.actual === "missing") && <td>-</td>}
                                {finding.actual && finding.actual !== "missing" && <td>{finding.actual}</td>}
                                <td>{finding.expected ?? "-"}</td>
                                <td>{finding.recommendation ?? "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};
