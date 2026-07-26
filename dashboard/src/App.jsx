import { useEffect, useMemo, useState } from "react";

import CRTMonitor from "./components/CRTMonitor";
import BootScreen from "./components/BootScreen";
import TopBar from "./components/TopBar";
import Explorer from "./components/Explorer";
import Workspace from "./components/Workspace";
import Terminal from "./components/Terminal";

import { PHASES } from "./data/Phases";
import AuthScreen from "./components/AuthScreen";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

const WORKSPACE_SLUG = import.meta.env.VITE_SUPABASE_WORKSPACE_SLUG || "vm-simulator";

export default function App() {
    const [checkedTasks, setCheckedTasks] = useState({});
    const [session, setSession] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState("CONNECTING");
    const [workspaceId, setWorkspaceId] = useState(null);

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

    useEffect(() => {
        if (!supabase) {
            setAuthLoading(false);
            return undefined;
        }

        supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
            setSession(activeSession);
            setAuthLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, activeSession) => setSession(activeSession)
        );

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!session || !supabase) {
            setWorkspaceId(null);
            setCheckedTasks({});
            return undefined;
        }

        let active = true;
        let channel;

        async function loadSharedProgress() {
            setSyncStatus("SYNCING");

            const { data: workspace, error: workspaceError } = await supabase
                .from("workspaces")
                .select("id")
                .eq("slug", WORKSPACE_SLUG)
                .single();

            if (workspaceError || !workspace) {
                if (active) setSyncStatus("NO TEAM ACCESS");
                return;
            }

            const { data: progress, error: progressError } = await supabase
                .from("task_progress")
                .select("task_id, completed")
                .eq("workspace_id", workspace.id);

            if (progressError) {
                if (active) setSyncStatus("SYNC ERROR");
                return;
            }

            if (!active) return;

            setWorkspaceId(workspace.id);
            setCheckedTasks(
                Object.fromEntries(progress.map((item) => [item.task_id, item.completed]))
            );
            setSyncStatus("TEAM SYNC ONLINE");

            channel = supabase
                .channel(`workspace-progress-${workspace.id}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "task_progress",
                        filter: `workspace_id=eq.${workspace.id}`,
                    },
                    ({ new: updatedTask }) => {
                        if (updatedTask?.task_id) {
                            setCheckedTasks((previous) => ({
                                ...previous,
                                [updatedTask.task_id]: updatedTask.completed,
                            }));
                        }
                    }
                )
                .subscribe();
        }

        loadSharedProgress();

        return () => {
            active = false;
            if (channel) supabase.removeChannel(channel);
        };
    }, [session]);

    async function toggleTask(id) {
        const task = allTasks.find((t) => t.id === id);

        const checked = !checkedTasks[id];

        setCheckedTasks((prev) => ({
            ...prev,
            [id]: checked,
        }));

        if (supabase && workspaceId && session) {
            const { error } = await supabase
                .from("task_progress")
                .upsert(
                    {
                        workspace_id: workspaceId,
                        task_id: id,
                        completed: checked,
                        updated_by: session.user.id,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: "workspace_id,task_id" }
                );

            if (error) {
                setCheckedTasks((prev) => ({ ...prev, [id]: !checked }));
                setSyncStatus("SYNC ERROR");
                return;
            }
        }

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

    if (!isSupabaseConfigured) {
        return (
            <div className="config-screen">
                SUPABASE CONFIGURATION MISSING. ADD VITE_SUPABASE_URL AND VITE_SUPABASE_PUBLISHABLE_KEY.
            </div>
        );
    }

    if (authLoading) {
        return <div className="config-screen">INITIALIZING TEAM NETWORK...</div>;
    }

    if (!session) {
        return <AuthScreen supabase={supabase} />;
    }

    return (
        <CRTMonitor>
            <div className="terminal-os">

                <TopBar
                    completed={completed}
                    total={total}
                    completedPhases={completedPhases}
                    totalPhases={PHASES.length}
                    syncStatus={syncStatus}
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
