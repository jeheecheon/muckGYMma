import React from "react";

interface PauseProps {
    className?: string;
}

function Pause({ className }: PauseProps) {
    return (
        <svg
            width={18}
            height={17}
            viewBox="0 0 25 24"
            className={`${className}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.15 19.11V4.89C11.15 3.54 10.58 3 9.14 3H5.51C4.07 3 3.5 3.54 3.5 4.89V19.11C3.5 20.46 4.07 21 5.51 21H9.14C10.58 21 11.15 20.46 11.15 19.11Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M21.5 19.11V4.89C21.5 3.54 20.93 3 19.49 3H15.86C14.43 3 13.85 3.54 13.85 4.89V19.11C13.85 20.46 14.42 21 15.86 21H19.49C20.93 21 21.5 20.46 21.5 19.11Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default Pause;
