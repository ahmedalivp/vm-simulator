import { useEffect, useState } from "react";

const bootLines = [
    "VM-220 TERMINAL BIOS v2.31",
    "Copyright (C) 1987 VM Systems",
    "",
    "CPU................. VirtualCPU-16",
    "Clock............... 4.77 MHz",
    "Memory Test......... 65536 KB OK",
    "Registers........... OK",
    "Flags............... OK",
    "Instruction Cache... OK",
    "Stack............... OK",
    "ALU................. OK",
    "Interrupt Table..... OK",
    "Opcode Table........ LOADED",
    "Filesystem.......... MOUNTED",
    "Execution Engine.... READY",
    "",
    "Booting Virtual CPU Simulator...",
    "",
    "Initializing Kernel................[ OK ]",
    "Loading Modules....................[ OK ]",
    "Starting Services..................[ OK ]",
    "",
    "SYSTEM READY",
    "",
    "root@vm:~$"
];

export default function BootScreen({ onFinish }) {

    const [displayed, setDisplayed] = useState([""]);

    useEffect(() => {

        let line = 0;
        let char = 0;

        const interval = setInterval(() => {

            if (line >= bootLines.length) {

                clearInterval(interval);

                setTimeout(() => {

                    onFinish();

                }, 300);

                return;

            }

            const current = bootLines[line];

            setDisplayed(prev => {

                const copy = [...prev];

                copy[line] = current.slice(0, char + 1);

                return copy;

            });

            char++;

            if (char > current.length) {

                line++;

                char = 0;

                setDisplayed(prev => [...prev, ""]);

            }

        }, 3);

        return () => clearInterval(interval);

    }, [onFinish]);

    return (

        <div className="boot-screen">

            <div className="boot-window">

                <div className="boot-title glow">

                    ╔════════════════════════════════════════════╗

                    <br />

                    ║        VM-220 TERMINAL WORKSTATION        ║

                    <br />

                    ╚════════════════════════════════════════════╝

                </div>

                <div className="boot-output">

                    {displayed.map((line, index) => {

                        const ready =
                            line === "SYSTEM READY";

                        return (

                            <div
                                key={index}
                                className={
                                    ready
                                        ? "boot-ready glow"
                                        : "boot-line"
                                }
                            >

                                {line}

                                {index === displayed.length - 1 && (

                                    <span className="cursor">

                                        █

                                    </span>

                                )}

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>

    );

}
