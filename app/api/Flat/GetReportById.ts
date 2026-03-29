import { isErrorMessage } from "~/types/ErrorMessage";
import type { VerificationReport } from "~/types/VerificationReport";
import { api } from "~/utils/lib/axios";

export interface ParamsForGetReportId { id: number; }

export const getReportById = async ({ id }: ParamsForGetReportId): Promise<VerificationReport> => {
    try {
        const response = await api.get(`/reports/${id}`);
        return response.data as VerificationReport;
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
