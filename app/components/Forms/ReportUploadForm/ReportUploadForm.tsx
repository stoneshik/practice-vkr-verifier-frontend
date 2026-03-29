import axios, { type AxiosProgressEvent } from 'axios';
import React, { useCallback, useEffect, useRef, useState, type ChangeEvent, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { getReportsPage, type ParamsForGetReportsPage } from '~/api/Flat/GetReportsPage';
import { createMessageStringFromErrorMessage, isErrorMessage } from '~/types/ErrorMessage';
import { ReportStatusDictionary } from '~/types/ReportStatus';
import type { VerificationReport } from '~/types/VerificationReport';
import { baseURL } from '~/utils/lib/axios';
import './ReportUploadForm.scss';

interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

export function ReportUploadForm(): JSX.Element {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [verificationReport, setVerificationReport] = useState<VerificationReport | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const load = useCallback(
        async (params: ParamsForGetReportsPage) => {
            try {
                const data = await getReportsPage(params);
                setVerificationReport(data.elements[0]);
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
            if (!verificationReport) return;
            const partUuid = verificationReport.id;
            try {
                await load({
                    partUuid: partUuid,
                    page: 0,
                    size: 1
                });
            } catch {
                setErrorMessage("Не получилось загрузить данные");
            }
        };
        fetchData();
        intervalId = setInterval(fetchData, 1_000);
        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, [
        verificationReport,
        load,
    ]);

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!validateFile(file)) {
            return;
        }
        setSelectedFile(file);
        setUploadStatus('idle');
        setErrorMessage('');
        setSuccessMessage('');
    };
    const validateFile = (file: File): boolean => {
        const allowedExtensions = new Set<string>([
            '.docx',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]);
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.has(fileExtension) && !allowedExtensions.has(file.type)) {
            setErrorMessage('Пожалуйста, выберите файл в формате .docx');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
                return false;
            }
        }
        const MB_250 = 250 * 1024 * 1024;
        const maxSize = MB_250;
        if (file.size > maxSize) {
            setErrorMessage(`Файл слишком большой. Максимальный размер: 250MB`);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
                return false;
            }
        }
        return true;
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile) {
            setErrorMessage('Пожалуйста, выберите файл для загрузки');
            return;
        }
        setUploadStatus('uploading');
        setErrorMessage('');
        setSuccessMessage('');
        setUploadProgress({ loaded: 0, total: selectedFile.size, percentage: 0 });
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const response = await axios.post<VerificationReport>(
                `${baseURL}/reports`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data', },
                    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                        if (progressEvent.total) {
                            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress({
                                loaded: progressEvent.loaded,
                                total: progressEvent.total,
                                percentage
                            });
                        }
                    },
                    withCredentials: true
                }
            );
            setVerificationReport(response.data as VerificationReport);
            setUploadStatus('success');
            setSuccessMessage("Файл успешно загружен");
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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
    const handleCancel = () => {
        setSelectedFile(null);
        setUploadStatus('idle');
        setErrorMessage('');
        setSuccessMessage('');
        setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    return (
        <>
        <div className="file-upload-container">
        <div className="file-upload-card">
            <h2 className="upload-title">Загрузка шаблона ВКР</h2>
            <p className="upload-subtitle">
                Загрузите docx файл шаблона ВКР для проверки
            </p>
            <form onSubmit={handleSubmit} className="upload-form">
                {/* Поле выбора файла */}
                <div className="file-input-container">
                    <label htmlFor="report-file" className="file-input-label">
                    <div className="file-input-area">
                        <div className="upload-icon">📁</div>
                            <div className="file-input-text">
                            <p className="file-input-title">
                                {selectedFile ? selectedFile.name : 'Выберите docx файл'}
                            </p>
                            <p className="file-input-hint">
                                {selectedFile
                                ? `Размер: ${formatFileSize(selectedFile.size)}`
                                : 'Нажмите для выбора файла или перетащите сюда'
                                }
                            </p>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        id="report-file"
                        type="file"
                        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileSelect}
                        className="file-input-hidden"
                        disabled={uploadStatus === 'uploading'}/>
                    </label>
                </div>
                {/* Информация о файле */}
                {selectedFile && (
                    <div className="file-info">
                        <div className="file-info-row">
                            <span className="file-info-label">Файл:</span>
                            <span className="file-info-value">{selectedFile.name}</span>
                        </div>
                        <div className="file-info-row">
                            <span className="file-info-label">Размер:</span>
                            <span className="file-info-value">{formatFileSize(selectedFile.size)}</span>
                        </div>
                        <div className="file-info-row">
                            <span className="file-info-label">Тип:</span>
                            <span className="file-info-value">{selectedFile.type}</span>
                        </div>
                    </div>
                )}
                {/* Прогресс-бар загрузки */}
                {uploadStatus === 'uploading' && (
                    <div className="upload-progress">
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${uploadProgress.percentage}%` }}/>
                        </div>
                        <div className="progress-info">
                            <span>Загрузка: {uploadProgress.percentage}%</span>
                            <span>
                            {formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)}
                            </span>
                        </div>
                    </div>
                )}
                {/* Кнопки действия */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                        disabled={uploadStatus === 'uploading'}>
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!selectedFile || uploadStatus === 'uploading'}>
                    {uploadStatus === 'uploading' ? (
                        <>
                        <span className="spinner"></span>
                        Шаблон ВКР загружается...
                        </>
                    ) : 'Загрузить файл'}
                    </button>
                </div>
            </form>
            {/* Сообщение об ошибке */}
            {errorMessage && (
            <div className="alert alert-error">
                <div className="alert-icon">❌</div>
                <div className="alert-content">
                <strong>Ошибка!</strong> {errorMessage}
                </div>
            </div>
            )}
            {/* Сообщение об успехе */}
            {successMessage && (
            <div className="alert alert-success">
                <div className="alert-icon">✅</div>
                <div className="alert-content">
                <strong>Успех!</strong> {successMessage}
                </div>
            </div>
            )}
            {/* Подсказка по формату файла */}
            <div className="format-hint">
                <h4>Требования к файлу:</h4>
                <ul>
                    <li>Формат docx</li>
                    <li>Максимальный размер файла: 250MB</li>
                </ul>
            </div>
        </div>
        </div>
        {verificationReport &&
        <div className="file-upload-container">
            <div className="file-upload-card">
                <h2>Загруженный отчёт</h2>
                <div className="format-hint">
                    <ul>
                        <li>id: <Link to={`/reports/${verificationReport.id}`}>{verificationReport.id}</Link></li>
                        <li>Статус: {ReportStatusDictionary[verificationReport.reportStatus]}</li>
                        <li>Время загрузки отчёта: {verificationReport.createdAt}</li>
                    </ul>
                </div>
            </div>
        </div>
        }
        </>
    );
};
