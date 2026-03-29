import { useCallback, useEffect, useState, type JSX } from "react";

import { getReportsPage, type ParamsForGetReportsPage } from "~/api/Flat/GetReportsPage";
import { ReportUploadForm } from "~/components/Forms/ReportUploadForm/ReportUploadForm";
import { ReportTable } from "~/components/Tables/Report/ReportTable/ReportTable";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { ReportsPage } from "~/types/ReportsPage";
import styles from "./HomePage.module.scss";

export default function HomePage(): JSX.Element {
    const [reportsPage, setReportsPage] = useState<ReportsPage | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [partUuid, setPartUuid] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);

    const load = useCallback(
        async (params: ParamsForGetReportsPage) => {
            try {
                const data = await getReportsPage(params);
                setReportsPage(data);
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
        let intervalId: NodeJS.Timeout;
        const fetchData = async () => {
            if (!mounted) return;
            try {
                await load({
                    partUuid,
                    page,
                    size,
                });
            } catch {
                setErrorMessage("Не получилось загрузить данные");
            }
        };
        fetchData();
        intervalId = setInterval(fetchData, 10_000);
        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, [
        partUuid,
        page,
        size,
        load,
    ]);

    const reports = reportsPage?.elements;
    const totalPages = reportsPage?.totalPages ?? 1;
    const totalElements = reportsPage?.totalElements ?? 0;

    const handlePrevPage = (): void => setPage((p) => Math.max(0, p - 1));
    const handleNextPage = (): void => setPage((p) => Math.min((totalPages - 1), p + 1));

    return (
        <>
        <div className={styles.wrapper}>
            <h1>Отчеты о проверках</h1>
            <h2>Всего найдено: {totalElements}</h2>
            <div className={styles.error}>{errorMessage}</div>
            <div className={styles.controls}>
                <input
                    type="text"
                    name="part_uuid_report"
                    placeholder="Поиск по uuid..."
                    value={partUuid}
                    style={{ width: 240 }}
                    onChange={(e) => {
                        setPartUuid(e.target.value);
                        setPage(0);
                    }}/>
                <select
                    name="size"
                    value={size}
                    onChange={(e) => {
                        setSize(Number(e.target.value));
                        setPage(0);
                    }}>
                    {[5, 10, 20].map((s) => (
                        <option key={s} value={s}>
                            {s} на страницу
                        </option>
                    ))}
                </select>
            </div>
            {reports && <ReportTable reports={reports} />}
            <div className={styles.pagination}>
                <Button onClick={handlePrevPage} textButton={"Назад"} disabled={page <= 0}/>
                <span>Страница {page + 1} из {totalPages}</span>
                <Button onClick={handleNextPage} textButton={"Вперед"} disabled={page >= totalPages - 1}/>
            </div>
            <ReportUploadForm />
        </div>
        </>
    );
}
