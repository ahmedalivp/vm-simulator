import { useRef } from "react";

export default function Explorer({
    phases,
    selected,
    onSelect,
}) {
    const treeRef = useRef(null);

    const currentIndex = phases.findIndex(
        (phase) => phase.id === selected.id
    );

    function scrollTree(direction) {
        treeRef.current?.scrollBy({
            left: direction * 240,
            behavior: "smooth",
        });
    }

    function previousPhase() {
        onSelect(
            phases[
                (currentIndex - 1 + phases.length) %
                    phases.length
            ]
        );
    }

    function nextPhase() {
        onSelect(
            phases[
                (currentIndex + 1) %
                    phases.length
            ]
        );
    }

    return (
        <aside className="explorer">

            {/* ===========================
                DESKTOP EXPLORER
            =========================== */}

            <div className="desktop-explorer">

                <div className="explorer-heading">

                    <div>

                        <div className="panel-title glow">
                            FILE SYSTEM
                        </div>

                        <div className="terminal-path">
                            root@vm:/$
                        </div>

                    </div>

                    <div
                        className="tree-controls"
                        aria-label="Browse phases"
                    >

                        <button
                            type="button"
                            onClick={() =>
                                scrollTree(-1)
                            }
                        >
                            ◀
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                scrollTree(1)
                            }
                        >
                            ▶
                        </button>

                    </div>

                </div>

                <div
                    ref={treeRef}
                    className="tree"
                >

                    {phases.map(
                        (phase, index) => {

                            const active =
                                selected.id ===
                                phase.id;

                            const isLast =
                                index ===
                                phases.length - 1;

                            return (
                                <button
                                    key={phase.id}
                                    onClick={() =>
                                        onSelect(
                                            phase
                                        )
                                    }
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
                                        {
                                            phase.addr
                                        }
                                        _
                                        {
                                            phase.dir
                                        }
                                    </span>

                                </button>
                            );
                        }
                    )}

                </div>

            </div>

            {/* ===========================
                MOBILE EXPLORER
            =========================== */}

            <div className="mobile-explorer">

                <div className="panel-title glow">
                    FILE SYSTEM
                </div>

                

                <div className="mobile-phase-picker">

                    <button
                        type="button"
                        onClick={previousPhase}
                    >
                        ◀
                    </button>

                    <div className="phase-display">

                        <div className="phase-code">
                            {selected.addr}_
                            {selected.dir}
                        </div>

                        <div className="phase-title">
                            {selected.title}
                        </div>

                      
                    </div>

                    <button
                        type="button"
                        onClick={nextPhase}
                    >
                        ▶
                    </button>

                </div>

            </div>

        </aside>
    );
}