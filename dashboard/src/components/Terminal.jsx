import { useEffect, useRef } from "react";

export default function Terminal({ logs }) {
    const terminalRef = useRef(null);

    useEffect(() => {
        terminalRef.current?.scrollTo({
            top: terminalRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [logs]);

    return (
        <footer className="terminal">

            

            <div
                ref={terminalRef}
                className="terminal-output"
            >

                
                <div className="terminal-banner">
                    Copyright (c) 2026 VM Systems
                </div>

                <div className="terminal-banner">
                    ----------------------------------------
                </div>

                {logs.map((log, index) => {

                    let type = "";

                    if (
                        log.toLowerCase().includes("compiled") ||
                        log.toLowerCase().includes("success")
                    ) {
                        type = "log-success";
                    } else if (
                        log.toLowerCase().includes("rollback") ||
                        log.toLowerCase().includes("removed") ||
                        log.toLowerCase().includes("error")
                    ) {
                        type = "log-error";
                    } else {
                        type = "log-normal";
                    }

                    return (
                        <div
                            key={index}
                            className={`terminal-line ${type}`}
                        >
                            <span className="terminal-arrow">
                                &gt;
                            </span>

                            <span>
                                {log}
                            </span>
                        </div>
                    );
                })}

                <div className="terminal-prompt">

                    <span className="prompt-user">
                        root@vm
                    </span>

                    <span>:</span>

                    <span className="prompt-path">
                        ~
                    </span>

                    <span>$</span>

                    <span className="cursor">
                        █
                    </span>

                </div>

            </div>

        </footer>
    );
}