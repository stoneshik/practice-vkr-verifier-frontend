import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import App, { ErrorBoundary } from "./root";

import "~/styles/globals.scss";

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} errorElement={<ErrorBoundary />}>
            <Route index element={<HomePage />} />
            </Route>
        </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
