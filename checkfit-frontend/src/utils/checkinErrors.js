const CHECKIN_ERROR_MESSAGES = {
    ACTIVITY_FULL: "Esta atividade está lotada. Todas as vagas já foram preenchidas.",
    ALREADY_CHECKED_IN: "Você já está inscrito nesta atividade. Confira no seu histórico de check-ins.",
    ALREADY_CHECKED_TODAY: "Você já fez um check-in hoje. Volte amanhã para uma nova atividade!",
    ACTIVITY_FINISHED: "Esta atividade já foi encerrada. Não é mais possível fazer check-in.",
};

const LEGACY_ENGLISH_MESSAGES = {
    "check-in unavailable. this activity is full": CHECKIN_ERROR_MESSAGES.ACTIVITY_FULL,
    "user has already checked in this activity": CHECKIN_ERROR_MESSAGES.ALREADY_CHECKED_IN,
    "user has already checked today": CHECKIN_ERROR_MESSAGES.ALREADY_CHECKED_TODAY,
    "unable to check in to an activity that has already finished": CHECKIN_ERROR_MESSAGES.ACTIVITY_FINISHED,
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

    if (normalized.includes("full") || normalized.includes("unavailable")) {
        return CHECKIN_ERROR_MESSAGES.ACTIVITY_FULL;
    }
    if (normalized.includes("already checked in this activity")) {
        return CHECKIN_ERROR_MESSAGES.ALREADY_CHECKED_IN;
    }
    if (normalized.includes("already checked today")) {
        return CHECKIN_ERROR_MESSAGES.ALREADY_CHECKED_TODAY;
    }
    if (normalized.includes("already finished")) {
        return CHECKIN_ERROR_MESSAGES.ACTIVITY_FINISHED;
    }

    return null;
}

export function getCheckinErrorMessage(error) {
    const data = error?.response?.data;

    if (data?.code && CHECKIN_ERROR_MESSAGES[data.code]) {
        return CHECKIN_ERROR_MESSAGES[data.code];
    }

    const candidates = [
        data?.message,
        data?.error,
        typeof data === "string" ? data : null,
    ];

    for (const candidate of candidates) {
        const legacyMessage = mapLegacyMessage(candidate);
        if (legacyMessage) return legacyMessage;

        if (typeof candidate === "string" && candidate.trim()) {
            return candidate;
        }
    }

    return "Não foi possível realizar o check-in. Tente novamente.";
}
