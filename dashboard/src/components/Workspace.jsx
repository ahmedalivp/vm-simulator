export default function Workspace({
    phase,
    checkedTasks,
    toggleTask,
}) {
    const completed = phase.tasks.filter(
        (task) => checkedTasks[task.id]
    ).length;

    return (
        <section className="workspace">

            <div className="workspace-header">

                <div>

                    <div className="panel-title glow">
                        DIRECTORY
                    </div>

                    <div className="workspace-path">
                        root@vm:/{phase.dir}$
                    </div>

                </div>

                <div className="workspace-progress">
                    [{completed}/{phase.tasks.length}]
                </div>

            </div>

            <div className="workspace-divider"></div>

            <div className="workspace-title">
                {phase.title}
            </div>

            <div className="workspace-subtitle">
                {phase.optional
                    ? "OPTIONAL MODULE"
                    : "CORE MODULE"}
            </div>

            <div className="workspace-tasks">

                {phase.tasks.map((task, index) => {

                    const checked =
                        checkedTasks[task.id];

                    return (
                        <button
                            key={task.id}
                            onClick={() =>
                                toggleTask(task.id)
                            }
                            className={`workspace-task ${
                                checked
                                    ? "task-complete"
                                    : ""
                            }`}
                        >

                            <span className="task-number">
                                {String(index + 1).padStart(
                                    2,
                                    "0"
                                )}
                            </span>

                            <span className="task-check">
                                {checked
                                    ? "[✓]"
                                    : "[ ]"}
                            </span>

                            <span className="task-text">
                                {task.text}
                            </span>

                        </button>
                    );
                })}

            </div>

        </section>
    );
}