const API_ERROR_MESSAGES = {
    // Auth
    USER_NOT_FOUND: "Usuário não encontrado. Verifique seu e-mail.",
    INVALID_PASSWORD: "Senha incorreta. Tente novamente.",
    EMAIL_ALREADY_REGISTERED: "Este e-mail já está cadastrado.",
    CPF_ALREADY_REGISTERED: "Este CPF já está cadastrado.",
    PHONE_ALREADY_REGISTERED: "Este telefone já está cadastrado.",
    INVALID_PHONE: "O telefone deve conter 10 ou 11 dígitos.",
    INVALID_CPF: "O CPF deve conter exatamente 11 dígitos.",
    INVALID_PASSWORD_FORMAT: "A senha deve ter pelo menos 8 caracteres, incluindo letras e números.",
    INVALID_EMAIL: "Formato de e-mail inválido.",

    // Check-in
    ACTIVITY_FULL: "Esta atividade está lotada. Todas as vagas já foram preenchidas.",
    ALREADY_CHECKED_IN: "Você já está inscrito nesta atividade. Confira no seu histórico de check-ins.",
    ALREADY_CHECKED_TODAY: "Você já fez um check-in hoje. Volte amanhã para uma nova atividade!",
    ACTIVITY_FINISHED: "Esta atividade já foi encerrada. Não é mais possível fazer check-in.",
    USER_OR_ACTIVITY_NOT_FOUND: "Usuário ou atividade não encontrados.",

    // Geral
    ACTIVITY_NOT_FOUND: "Atividade não encontrada.",
    CHECKIN_NOT_FOUND: "Check-in não encontrado.",
    ACCESS_DENIED: "Você não tem permissão para realizar esta ação.",
};

const LEGACY_ENGLISH_MESSAGES = {
    "user not found": API_ERROR_MESSAGES.USER_NOT_FOUND,
    "invalid password": API_ERROR_MESSAGES.INVALID_PASSWORD,
    "email already registered": API_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED,
    "cpf already registered": API_ERROR_MESSAGES.CPF_ALREADY_REGISTERED,
    "phone already registered": API_ERROR_MESSAGES.PHONE_ALREADY_REGISTERED,
    "phone number must contain 10 or 11 digits": API_ERROR_MESSAGES.INVALID_PHONE,
    "cpf must contain exactly 11 digits": API_ERROR_MESSAGES.INVALID_CPF,
    "password must have at least 8 characters, including letters and numbers": API_ERROR_MESSAGES.INVALID_PASSWORD_FORMAT,
    "invalid email format": API_ERROR_MESSAGES.INVALID_EMAIL,
    "check-in unavailable. this activity is full": API_ERROR_MESSAGES.ACTIVITY_FULL,
    "user has already checked in this activity": API_ERROR_MESSAGES.ALREADY_CHECKED_IN,
    "user has already checked today": API_ERROR_MESSAGES.ALREADY_CHECKED_TODAY,
    "unable to check in to an activity that has already finished": API_ERROR_MESSAGES.ACTIVITY_FINISHED,
    "user or activity not found": API_ERROR_MESSAGES.USER_OR_ACTIVITY_NOT_FOUND,
    "access denied": API_ERROR_MESSAGES.ACCESS_DENIED,
    "forbidden": API_ERROR_MESSAGES.ACCESS_DENIED,
};

function normalizeText(value) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function mapLegacyMessage(text) {
    const normalized = normalizeText(text);
    if (!normalized) return null;

    if (LEGACY_ENGLISH_MESSAGES[normalized]) {
        return LEGACY_ENGLISH_MESSAGES[normalized];
    }

    if (normalized.includes("email already registered")) return API_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED;
    if (normalized.includes("cpf already registered")) return API_ERROR_MESSAGES.CPF_ALREADY_REGISTERED;
    if (normalized.includes("phone already registered")) return API_ERROR_MESSAGES.PHONE_ALREADY_REGISTERED;
    if (normalized.includes("invalid password")) return API_ERROR_MESSAGES.INVALID_PASSWORD;
    if (normalized.includes("user not found")) return API_ERROR_MESSAGES.USER_NOT_FOUND;
    if (normalized.includes("already checked in this activity")) return API_ERROR_MESSAGES.ALREADY_CHECKED_IN;
    if (normalized.includes("already checked today")) return API_ERROR_MESSAGES.ALREADY_CHECKED_TODAY;
    if (normalized.includes("activity is full") || normalized.includes("unavailable")) return API_ERROR_MESSAGES.ACTIVITY_FULL;
    if (normalized.includes("already finished")) return API_ERROR_MESSAGES.ACTIVITY_FINISHED;
    if (normalized.includes("access denied") || normalized.includes("forbidden")) return API_ERROR_MESSAGES.ACCESS_DENIED;

    return null;
}

function extractRawMessage(data) {
    if (!data) return null;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors[0].defaultMessage || data.errors[0].message;
    }
    return null;
}

export function getApiErrorMessage(error, fallback = "Ocorreu um erro. Tente novamente.") {
    const data = error?.response?.data;

    if (data?.code && API_ERROR_MESSAGES[data.code]) {
        return API_ERROR_MESSAGES[data.code];
    }

    const rawMessage = extractRawMessage(data);
    const legacyMessage = mapLegacyMessage(rawMessage);
    if (legacyMessage) return legacyMessage;

    if (rawMessage?.trim()) {
        return rawMessage;
    }

    if (error?.response?.status === 403) {
        return API_ERROR_MESSAGES.ACCESS_DENIED;
    }

    return fallback;
}

export function getCheckinErrorMessage(error) {
    return getApiErrorMessage(error, "Não foi possível realizar o check-in. Tente novamente.");
}
