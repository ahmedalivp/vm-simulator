import { useState } from "react";

export default function AuthScreen({ supabase }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState("signin");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(event) {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        const action = mode === "signin"
            ? supabase.auth.signInWithPassword({ email, password })
            : supabase.auth.signUp({ email, password });

        const { error } = await action;

        setLoading(false);

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage(
            mode === "signin"
                ? "SYSTEM ACCESS GRANTED"
                : "ACCOUNT CREATED. CONFIRM YOUR EMAIL, THEN SIGN IN."
        );
    }

    return (
        <div className="auth-screen">
            <form className="auth-card" onSubmit={submit}>
                <div className="auth-kicker">VM-220 // TEAM NETWORK</div>
                <h1>{mode === "signin" ? "TEAM SIGN IN" : "CREATE TEAM ACCOUNT"}</h1>
                <p>Sign in to access the shared project checklist.</p>

                <label>
                    EMAIL
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />
                </label>

                <label>
                    PASSWORD
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete={mode === "signin" ? "current-password" : "new-password"}
                        minLength="6"
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "CONNECTING..." : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
                </button>

                <button
                    className="auth-switch"
                    type="button"
                    onClick={() => {
                        setMode(mode === "signin" ? "signup" : "signin");
                        setMessage("");
                    }}
                >
                    {mode === "signin" ? "NEW TEAM MEMBER? CREATE ACCOUNT" : "ALREADY REGISTERED? SIGN IN"}
                </button>

                {message && <div className="auth-message">{message}</div>}
            </form>
        </div>
    );
}
