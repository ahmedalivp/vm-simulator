import { useEffect, useState } from "react";

export default function TopBar({
    completed,
    total,
    completedPhases,
    totalPhases,
    syncStatus,
}) {
    const [time, setTime] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();

            const date = now.toLocaleDateString("en-GB");

            const clock = now.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });

            setTime(`${date} ${clock}`);
        };

        update();

        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, []);

    const statusClass =
        syncStatus === "SYNC ERROR" || syncStatus === "NO TEAM ACCESS"
            ? "status-led-error"
            : syncStatus === "SYNCING" || syncStatus === "CONNECTING"
            ? "status-led-pending"
            : "status-led-ok";

    return (
        <header className="topbar">

            <div className="topbar-left">

                <div className="topbar-title">
                    VIRTUAL CPU SIMULATOR
                    <span className={`status-led-inline ${statusClass}`}></span>
                </div>

                <div className="topbar-subtitle">
                    root@vm:~$
                </div>

            </div>

            <div className="topbar-center">

                <span className="status-led"></span>

                <span className="status-text">
                    {syncStatus || "SYSTEM READY"}
                </span>

            </div>

            <div className="topbar-right">

                <div className="progress-block">
                    {completed}/{total} TASKS
                </div>

                <div className="progress-block">
                    {completedPhases}/{totalPhases} PHASES
                </div>

                <div className="clock-block">
                    {time}
                </div>

            </div>

        </header>
    );
}