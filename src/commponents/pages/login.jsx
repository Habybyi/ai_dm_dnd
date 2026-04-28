import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/input.jsx";
import Button from "../ui/button.jsx";
import StatusIcon from "../ui/statusicon.jsx";

export default function Login() {
    const navigate = useNavigate();

    const [UserPassword, setUserPassword] = useState("");
    const [UserEmail, setUserEmail] = useState("");

    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState("neutral");
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        setLoading(true);
        setSubmitStatus("neutral");

        try {
            const response = await fetch("http://localhost:3030/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    UserEmail,
                    UserPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setServerError(data.message || "Prihlásenie zlyhalo");
                setSubmitStatus("error");
                return;
            }

            localStorage.setItem("token", data.token);

            setSubmitStatus("success");
            window.location.href = "/dashboard";
        } catch (err) {
            setServerError("Nepodarilo sa spojiť so serverom");
            setSubmitStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Prihlásenie</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="email">Email</label>
                    <Input id="email" type="email" name="email"
                           value={UserEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Your email..." required error={!!errors.UserEmail}/>
                    {errors.UserEmail && (
                        <p style={{ color: "#C0392B", fontSize: "12px" }}>Zadaj platný email</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password">Heslo</label>
                    <Input id="password" type="password" name="password"
                           ovalue={UserPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Your passowrd..." required error={!!errors.UserPassword} />
                    {errors.password && (
                        <p style={{ UserPassword: "#C0392B", fontSize: "12px" }}>Zadaj heslo</p>
                    )}
                </div>

                {serverError && (
                    <p style={{ color: "#C0392B", fontSize: "13px" }}>{serverError}</p>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Prihlasujem..." : "Prihlásiť sa"}
                    </Button>
                    <StatusIcon status={submitStatus} />
                </div>

            </form>

            <p>
                Nemáš účet? <a href="/register">Zaregistruj sa</a>
            </p>
        </div>
    );
}