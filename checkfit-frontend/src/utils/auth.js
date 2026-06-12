import { jwtDecode } from "jwt-decode";

export function persistAuth(token) {
    localStorage.setItem("token", token);
    try {
        const decoded = jwtDecode(token);
        localStorage.setItem("role", decoded.role || "USER");
        if (decoded.name) {
            localStorage.setItem("userName", decoded.name);
        }
    } catch {
        localStorage.setItem("role", "USER");
    }
}

export function getStoredUserName() {
    const storedName = localStorage.getItem("userName");
    if (storedName) return storedName;

    const token = localStorage.getItem("token");
    if (!token) return "";

    try {
        const decoded = jwtDecode(token);
        if (decoded.name) {
            localStorage.setItem("userName", decoded.name);
            return decoded.name;
        }
    } catch {
        return "";
    }

    return "";
}

export function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
}
