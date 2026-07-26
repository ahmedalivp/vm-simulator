import Header from "./components/Header";
import ProgressBar from "./components/Progressbar";
import useLocalStorage from "./hooks/useLocalStorage";
import Phase from "./components/Phase";
import { PHASES } from "./data/Phases";
export default function App() {
  const [checkedTasks, setCheckedTasks] =
    useLocalStorage("checkedTasks", {});
  const toggleTask = (taskId) => {
    setCheckedTasks((prev) => ({
        ...prev,
        [taskId]: !prev[taskId],
    }));
};
  const [collapsedPhases, setCollapsedPhases] =
    useLocalStorage("collapsedPhases", {});
const totalTasks = PHASES.reduce(
    (sum, phase) => sum + phase.tasks.length,
    0
);

const completedTasks = Object.values(checkedTasks).filter(Boolean).length;
const togglePhase = (phaseId) => {
    setCollapsedPhases((prev) => ({
        ...prev,
        [phaseId]: !prev[phaseId],
    }));
};
 return (
    <div className="app">
        <Header />

        <ProgressBar
            completed={completedTasks}
            total={totalTasks}
        />

        {PHASES.map((phase) => (
            <Phase
                key={phase.id}
                phase={phase}
                checkedTasks={checkedTasks}
                toggleTask={toggleTask}
                collapsed={collapsedPhases[phase.id]}
                togglePhase={togglePhase}
            />
        ))}
    </div>
);
}