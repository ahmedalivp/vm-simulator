export default function ProgressBar({ completed, total }) {
    const percentage = total === 0 ? 0 : (completed / total) * 100;

    return (
        <div style={{ marginBottom: "20px" }}>
            <p>
                {completed} / {total} Tasks ({Math.round(percentage)}%)
            </p>

            <div
                style={{
                    width: "100%",
                    height: "20px",
                    background: "#333",
                    borderRadius: "10px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: "#4CAF50",
                    }}
                />
            </div>
        </div>
    );
}