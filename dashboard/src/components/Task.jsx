export default function Task({
    task,
    checked,
    toggleTask,
}) {
    return (
        <li
    className={checked ? "task checked" : "task"}
            onClick={() => toggleTask(task.id)}
            style={{
                cursor: "pointer",
                userSelect: "none",
            }}
        >
            {checked ? "☑" : "☐"} {task.text}
        </li>
    );
}