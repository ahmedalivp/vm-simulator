export default function CRTMonitor({ children }) {
    return (
        <div className="crt-room">
            <div className="crt-monitor">

                {/* Top Vent */}
                <div className="crt-top-vents">
                    {Array.from({ length: 36 }).map((_, i) => (
                        <span key={i}></span>
                    ))}
                </div>

                {/* Branding */}
                <div className="crt-header">
                    <div className="crt-brand">
                        <span className="brand-title">VM-220 TERMINAL</span>
                        <span className="brand-model">MK-II</span>
                    </div>

                    <div className="crt-team">
                        AHMED · BASU · IJAZ · AMMAR
                    </div>

                    <div className="crt-serial">
                        SERIAL #000042
                    </div>
                </div>

                {/* Screen */}
                <div className="crt-screen-frame">

                    <div className="crt-screen">

                        <div className="crt-glow"></div>

                        <div className="crt-reflection"></div>

                        <div className="crt-noise"></div>

                        <div className="crt-scanlines"></div>

                        <div className="crt-phosphor" aria-hidden="true"></div>

                        <div className="crt-roll" aria-hidden="true"></div>

                        <div className="crt-flicker" aria-hidden="true"></div>

                        <div className="crt-content">
                            {children}
                        </div>

                        <div className="crt-glass" aria-hidden="true"></div>

                    </div>

                </div>

                {/* Bottom Panel */}
                <div className="crt-bottom">

                    <div className="crt-power">

                        <div className="crt-led"></div>

                        <span>POWER</span>

                    </div>

                    <div className="crt-center">
                        VIRTUAL CPU WORKSTATION
                    </div>

                    <div className="crt-year">
                        1987
                    </div>

                </div>

            </div>
        </div>
    );
}
