export interface ErrorMessage {
    time: string;
    message: string;
    violations: Record<string, string>;
}

export const isErrorMessage = (obj: any): obj is ErrorMessage => {
    return (
        obj &&
        typeof obj.time === "string" &&
        typeof obj.message === "string" &&
        obj.violations &&
        typeof obj.violations === "object"
    );
};

export const createMessageStringFromErrorMessage = (errorMessage: ErrorMessage): string => {
    const violations = errorMessage.violations;
    const stringWithFields = Object.entries(violations)
            .map(([nameField, description]) => `${nameField} - ${description}`)
            .join(", ");
    const message = `${errorMessage.message}: ${stringWithFields}`;
    return message;
}
