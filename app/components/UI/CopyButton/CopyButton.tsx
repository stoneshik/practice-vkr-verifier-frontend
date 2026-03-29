import { useState } from "react";
import styles from "./CopyButton.module.scss";

type CopyButtonProps = {
    text: string;
};

export const CopyButton = ({ text }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch (error) {
            console.error("Ошибка копирования:", error);
        }
    };
    return (
        <button className={styles.button} onClick={handleCopy}>
            {copied ? "Скопировано" : "Копировать"}
        </button>
    );
};