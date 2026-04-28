import { useState,useEffect } from "react";
import Input from "../ui/input.jsx";
import Button from "../ui/button.jsx";

export default function Register() {
    const [UserName, setUserName] = useState("");
    const [UserPassword, setUserPassword] = useState("");
    const [UserEmail, setUserEmail] = useState("");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3030/api/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    UserName,
                    UserEmail,
                    UserPassword,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setServerError(data.message || "Registrácia zlyhala");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("UserName", data.UserName);
            window.location.href = "/dashboard";
        } catch (err) {
            setServerError("Nepodarilo sa spojiť so serverom");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "AI_DM | Register";
    }, []);

    return (
        <div>
            <h2>Registrácia</h2>
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="username">Prezývka</label>
                    <Input id="username" type="text" name="username"
                           value={UserName} onChange={(e) => setUserName(e.target.value)}  placeholder="napr. Gandalf" required />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <Input id="email" type="email" name="email"
                           value={UserEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="email@example.com" required error={!!errors.UserEmail}/>
                </div>

                <div>
                    <label htmlFor="password">Heslo</label>
                    <Input id="password" type="password" name="password"
                           ovalue={UserPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="min. 6 znakov" required error={!!errors.UserPassword} />
                </div>

                {serverError && <p style={{ color: "#C0392B", fontSize: "13px" }}>{serverError}</p>}

                <Button type="submit" disabled={loading}>
                    {loading ? "Registrujem..." : "Zaregistrovať sa"}
                </Button>

            </form>
            <p>Už máš účet? <a href="/login">Prihlás sa</a></p>
        </div>
    );
}