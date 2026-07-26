import { useRef } from "react";

export default function Explorer({
    phases,
    selected,
    onSelect,
}) {
    const treeRef = useRef(null);

    function scrollTree(direction) {
        const tree = treeRef.current;

        if (!tree) return;

        const isHorizontal = tree.scrollWidth > tree.clientWidth;

        tree.scrollBy({
            left: isHorizontal ? direction * 240 : 0,
            top: isHorizontal ? 0 : direction * 180,
            behavior: "smooth",
        });
    }

    return (
        <aside className="explorer">

            <div className="explorer-heading">
                <div>
                    <div className="panel-title glow">
                        FILE SYSTEM
                    </div>

                    <div className="terminal-path">
                        root@vm:/$
                    </div>
                </div>

                <div className="tree-controls" aria-label="Browse phases">
                    <button
                        type="button"
                        aria-label="Previous phases"
                        onClick={() => scrollTree(-1)}
                    >
                        ◀ PREV
                    </button>
                    <button
                        type="button"
                        aria-label="Next phases"
                        onClick={() => scrollTree(1)}
                    >
                        NEXT ▶
                    </button>
                </div>
            </div>

            <div ref={treeRef} className="tree">

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
