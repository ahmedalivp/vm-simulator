import { useMemo, useState } from "react";

import CRTMonitor from "./components/CRTMonitor";
import BootScreen from "./components/BootScreen";
import TopBar from "./components/TopBar";
import Explorer from "./components/Explorer";
import Workspace from "./components/Workspace";
import Terminal from "./components/Terminal";

import { PHASES } from "./data/Phases";
import useLocalStorage from "./hooks/useLocalStorage";

export default function App() {
    const [checkedTasks, setCheckedTasks] = useLocalStorage(
        "checkedTasks",
        {}
    );

    const [bootFinished, setBootFinished] = useState(false);

    // Selected directory (phase)
    const [selectedPhase, setSelectedPhase] = useState(PHASES[0]);

    const [logs, setLogs] = useState([
        "Phoenix BIOS 4.0",
        "Memory Test.....................OK",
        "Virtual CPU.....................READY",
        "",
        "root@vm:~$",
    ]);

    const allTasks = useMemo(
        () =>
            PHASES.flatMap((phase) =>
                phase.tasks.map((task) => ({
                    ...task,
                    phase: phase.title,
                    phaseAddr: phase.addr,
                }))
            ),
        []
    );

    const completed = allTasks.filter(
        (task) => checkedTasks[task.id]
    ).length;

    const total = allTasks.length;

    const completedPhases = PHASES.filter((phase) =>
        phase.tasks.every((task) => checkedTasks[task.id])
    ).length;

    const currentTask = useMemo(() => {
        return allTasks.find(
            (task) => !checkedTasks[task.id]
        );
    }, [allTasks, checkedTasks]);

    function toggleTask(id) {
        const task = allTasks.find((t) => t.id === id);

        const checked = !checkedTasks[id];

        setCheckedTasks((prev) => ({
            ...prev,
            [id]: checked,
        }));

        const time = new Date().toLocaleTimeString([], {
            hour12: false,
        });

        if (checked) {
            setLogs((prev) => [
                ...prev,
                `[${time}] root@vm:/${selectedPhase.addr.toLowerCase()}$ compile`,
                "",
                `Compiling ${task.text}...`,
                "OK",
                "",
            ]);
        } else {
            setLogs((prev) => [
                ...prev,
                `[${time}] root@vm:/${selectedPhase.addr.toLowerCase()}$ rollback`,
                "",
                `Removing ${task.text}...`,
                "DONE",
                "",
            ]);
        }
    }

    if (!bootFinished) {
        return (
            <BootScreen
                onFinish={() => setBootFinished(true)}
            />
        );
    }

    return (
        <CRTMonitor>
            <div className="terminal-os">

                <TopBar
                    completed={completed}
                    total={total}
                    completedPhases={completedPhases}
                    totalPhases={PHASES.length}
                    currentTask={currentTask}
                />

                <div className="terminal-main">

                    <Explorer
                        phases={PHASES}
                        selected={selectedPhase}
                        onSelect={setSelectedPhase}
                    />

                    <Workspace
                        phase={selectedPhase}
                        checkedTasks={checkedTasks}
                        toggleTask={toggleTask}
                    />

                </div>

                <Terminal logs={logs} />

            </div>
        </CRTMonitor>
    );
}
