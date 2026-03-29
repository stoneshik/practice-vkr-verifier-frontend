import { isErrorMessage } from "~/types/ErrorMessage";
import type { ReportsPage } from "~/types/ReportsPage";
import { api } from "~/utils/lib/axios";

export interface ParamsForGetReportsPage {
    partUuid: string;
    page: number;
    size: number;
}

export const getReportsPage = async ({
    partUuid,
    page,
    size
}: ParamsForGetReportsPage): Promise<ReportsPage> => {
    try {
        const params: Record<string, string | number> = {
            page,
            size,
        };
        if (partUuid !== "") { params.partUuid = partUuid; }
        const response = await api.get("/reports", { params });
        return response.data as ReportsPage;
    } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
            // @ts-ignore
            const status = error.response?.status;
            // @ts-ignore
            const data = error.response?.data;
            if (isErrorMessage(data)) { throw data; }
            throw new Error(`Серверная ошибка ${status}: ${JSON.stringify(data)}`);
        }
        throw new Error(String(error));
    }
};
