export function getAuthHeader() {
    const token = localStorage.getItem("jwt");
    if (!token) {
        throw new Error("Token không tồn tại trong localStorage.");
    }
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}
