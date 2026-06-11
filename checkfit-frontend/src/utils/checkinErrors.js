const CHECKIN_ERROR_MESSAGES = {
    ACTIVITY_FULL: "Esta atividade está lotada. Todas as vagas já foram preenchidas.",
    ALREADY_CHECKED_IN: "Você já está inscrito nesta atividade. Confira no seu histórico de check-ins.",
    ALREADY_CHECKED_TODAY: "Você já fez um check-in hoje. Volte amanhã para uma nova atividade!",
    ACTIVITY_FINISHED: "Esta atividade já foi encerrada. Não é mais possível fazer check-in.",
};

export function getCheckinErrorMessage(error) {
    const data = error?.response?.data;

    if (data?.code && CHECKIN_ERROR_MESSAGES[data.code]) {
        return CHECKIN_ERROR_MESSAGES[data.code];
    }

    return data?.message || data?.error || "Não foi possível realizar o check-in. Tente novamente.";
}
