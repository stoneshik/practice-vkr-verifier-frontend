import { useCallback, useEffect, useState, type JSX } from "react";
import { Link, useParams } from "react-router-dom";

import { getReportById, type ParamsForGetReportId } from "~/api/Flat/GetReportById";
import { ReportJsonTable } from "~/components/Tables/Report/ReportJsonTable/ReportJsonTable";
import { RulesTable } from "~/components/Tables/Report/RulesTable/RulesTable";
import { CopyButton } from "~/components/UI/CopyButton/CopyButton";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { JsonReport } from "~/types/JsonReport/JsonReport";
import { ReportStatusDictionary } from "~/types/ReportStatus";
import type { VerificationReport } from "~/types/VerificationReport";
import { baseURL } from "~/utils/lib/axios";
import styles from "./ReportByIdPage.module.scss";

export default function ReportByIdPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [report, setReport] = useState<VerificationReport | null>(null);
    const [jsonReport, setJsonReport] = useState<JsonReport | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const load = useCallback(
        async (params: ParamsForGetReportId) => {
            try {
                const data = await getReportById(params);
                setReport(data);
                if (data.reportJson) {
                    setJsonReport(JSON.parse(data.reportJson));
                }
                setErrorMessage("");
            } catch (error) {
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
            }
        }, []
    );

    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            if (!mounted) return;
            if (!id) return;
            try {
                await load({ id });
            } catch {
                setErrorMessage("Не получилось загрузить данные");
            }
        };
        fetchData();
        return () => { mounted = false; };
    }, [id, load]);

    return (
        <div className={styles.wrapper}>
            <h1>Отчёт о проверке шаблона ВКР</h1>
            <div className={styles.error}>{errorMessage}</div>
            {report &&
                <>
                <ul>
                    <li><b>id:</b> <Link to={`/reports/${report.id}`}>{report.id}</Link> <CopyButton text={report.id}/></li>
                    <li><b>Статус:</b> {ReportStatusDictionary[report.reportStatus]}</li>
                    <li><b>Время загрузки отчёта:</b> {report.createdAt}</li>
                </ul>
                <a href={`${baseURL}/reports/${report.id}/json`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.jsonReport}>
                    Открыть полный json отчёт
                </a>
                </>
            }
            {!report && <h2>Отчет по проверке не сформирован</h2>}
            {jsonReport && <ReportJsonTable jsonReport={jsonReport}/>}
            <RulesTable/>
        </div>
    );
}
