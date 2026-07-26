import Task from "./Task";
export default function Phase({
    phase,
    checkedTasks,
    toggleTask,
    collapsed,
    togglePhase
}) {
    return (
        <div className="phase-card">
            <h2
    className="phase-title"
    onClick={() => togglePhase(phase.id)}
>
    {collapsed ? "▶" : "▼"} {phase.addr} - {phase.title}
</h2>
            {!collapsed && (
    <ul>
        {phase.tasks.map((task) => (
            <Task
                key={task.id}
                task={task}
                checked={checkedTasks[task.id]}
                toggleTask={toggleTask}
            />
        ))}
    </ul>
)}
        </div>
    );
}