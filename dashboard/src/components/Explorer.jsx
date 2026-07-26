export default function Explorer({
    phases,
    selected,
    onSelect,
}) {
    return (
        <aside className="explorer">

            <div className="panel-title glow">
                FILE SYSTEM
            </div>

            <div className="terminal-path">
                root@vm:/$
            </div>

            <div className="tree">

                {phases.map((phase, index) => {

                    const active =
                        selected.id === phase.id;

                    const isLast =
                        index === phases.length - 1;

                    return (
                        <button
                            key={phase.id}
                            onClick={() => onSelect(phase)}
                            className={`tree-item ${
                                active
                                    ? "active-tree"
                                    : ""
                            }`}
                        >

                            <span className="tree-prefix">
                                {active
                                    ? "▶"
                                    : isLast
                                    ? "└"
                                    : "├"}
                            </span>

                            <span className="tree-name">
                                {phase.addr}_{phase.dir}
                            </span>

                        </button>
                    );
                })}

            </div>

        </aside>
    );
}