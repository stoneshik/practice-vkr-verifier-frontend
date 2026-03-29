import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import App, { ErrorBoundary } from "./root";

import "~/styles/globals.scss";
import ReportByIdPage from "./pages/Report/ReportByIdPage/ReportByIdPage";

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} errorElement={<ErrorBoundary />}>
            <Route index element={<HomePage />} />
            <Route path="reports/:id" element={<ReportByIdPage />} />
            </Route>
        </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
