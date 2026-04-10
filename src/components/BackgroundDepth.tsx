export default function BackgroundDepth() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Upper third — 4 lines */}
        <path
          d="M -60 120 C 180 60, 360 180, 580 110 S 960 200, 1180 130 S 1500 90, 1700 160"
          fill="none"
          stroke="#000"
          strokeOpacity="0.05"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M -40 210 C 220 140, 420 260, 660 190 Q 900 130, 1140 230 T 1680 200"
          fill="none"
          stroke="#000"
          strokeOpacity="0.04"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Nested pair around an implicit upper-right "hill" */}
        <path
          d="M 820 60 C 980 40, 1180 80, 1280 170 S 1240 310, 1060 330 S 820 270, 820 60 Z"
          fill="none"
          stroke="#000"
          strokeOpacity="0.055"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 870 100 C 1000 85, 1150 120, 1230 185 S 1200 285, 1060 295 S 870 245, 870 100 Z"
          fill="none"
          stroke="#000"
          strokeOpacity="0.045"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Middle third — 5 lines */}
        <path
          d="M -80 360 C 240 280, 480 440, 720 360 S 1080 280, 1320 400 S 1600 360, 1760 420"
          fill="none"
          stroke="#000"
          strokeOpacity="0.06"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M -50 450 C 260 520, 520 400, 780 470 Q 1020 540, 1260 450 T 1720 480"
          fill="none"
          stroke="#000"
          strokeOpacity="0.05"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Nested trio — lower-left "basin" */}
        <path
          d="M 120 420 C 260 360, 460 380, 560 470 S 500 610, 340 620 S 80 560, 120 420 Z"
          fill="none"
          stroke="#000"
          strokeOpacity="0.06"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 160 450 C 280 400, 440 420, 520 490 S 470 580, 340 590 S 130 540, 160 450 Z"
          fill="none"
          stroke="#000"
          strokeOpacity="0.05"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 200 480 C 290 445, 410 460, 480 510 S 440 560, 340 565 S 180 530, 200 480 Z"
          fill="none"
          stroke="#000"
          strokeOpacity="0.04"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lower third — 3 lines */}
        <path
          d="M -60 700 C 220 620, 460 760, 700 680 S 1060 620, 1300 720 S 1620 680, 1760 740"
          fill="none"
          stroke="#000"
          strokeOpacity="0.055"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M -40 800 C 260 740, 520 860, 780 790 Q 1040 720, 1280 820 T 1720 800"
          fill="none"
          stroke="#000"
          strokeOpacity="0.045"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M -80 870 C 300 820, 600 920, 900 860 S 1340 800, 1700 880"
          fill="none"
          stroke="#000"
          strokeOpacity="0.04"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
