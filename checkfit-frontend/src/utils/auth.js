import { jwtDecode } from "jwt-decode";

export function persistAuth(token) {
    localStorage.setItem("token", token);
    try {
        const decoded = jwtDecode(token);
        localStorage.setItem("role", decoded.role || "USER");
    } catch {
        localStorage.setItem("role", "USER");
    }
}
