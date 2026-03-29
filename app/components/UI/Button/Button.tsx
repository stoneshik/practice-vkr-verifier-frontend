import styles from "./Button.module.scss";

interface ButtonProps {
    className?: string;
    onClick?: () => void;
    textButton: string;
    disabled?: boolean;
}

export const Button = (
    {className, onClick, textButton, disabled}: ButtonProps
) => {
    return (
        <button
            className={className ?? styles.button}
            onClick={onClick}
            disabled={disabled}>
            {textButton}
        </button>
    );
};
