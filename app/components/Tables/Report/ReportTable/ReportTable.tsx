import type { JSX } from "react";
import { Link } from "react-router-dom";
import { ReportStatusDictionary } from "~/types/ReportStatus";
import type { VerificationReport } from "~/types/VerificationReport";
import styles from "./ReportTable.module.scss";

interface ReportTableProps {
    reports: VerificationReport[];
}

export const ReportTable = ({ reports } : ReportTableProps): JSX.Element => {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>id</th>
                    <th>Статус</th>
                    <th>Время загрузки отчёта</th>
                </tr>
            </thead>
            <tbody>
            {reports.map(
                (report) => (
                    <tr key={report.id}>
                        <td>
                            <Link to={`/reports/${report.id}`}>
                                {report.id}
                            </Link>
                        </td>
                        <td>{ReportStatusDictionary[report.reportStatus]}</td>
                        <td>{report.createdAt}</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
