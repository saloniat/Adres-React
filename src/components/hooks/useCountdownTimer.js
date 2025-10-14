import React, { useEffect, useState } from "react";

const calculateTimeLeft = (
    startDate,
    endDate,
    thresholdsMs = 5 * 60 * 1000
) => {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < start) {
        const timeToStart = start - now;
        const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeToStart / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeToStart / (1000 * 60)) % 60);
        const seconds = Math.floor((timeToStart / 1000) % 60);
        return {
            status: timeToStart <= thresholdsMs ? "coming_soon" : "not_started",
            days,
            hours,
            minutes,
            seconds,
            isActive: false,
            isComingSoon: true,
        };
    }

    if (now >= start && now <= end) {
        const timeLeft = end - now;
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        return {
            status: timeLeft <= thresholdsMs ? "nearby_to_close" : "running",
            days,
            hours,
            minutes,
            seconds,
            isActive: true,
        };
    }
    const timeSinceEnd = now - end;
    return {
        status: timeSinceEnd <= thresholdsMs ? "recently_closed" : "expired",
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isActive: false,
    };
};

const useCountdownTimer = (startDate, endDate, thresholdsMs) => {
    const [timeLeft, setTimeLeft] = useState(
        calculateTimeLeft(startDate, endDate, thresholdsMs)
    );

    useEffect(() => {
        if (timeLeft.status === "expired") return;
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(
                startDate,
                endDate,
                thresholdsMs
            );
            setTimeLeft(newTimeLeft);

            if (newTimeLeft.status === "expired") {
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [startDate, endDate, timeLeft.status]);

    useEffect(() => {
        setTimeLeft(calculateTimeLeft(startDate, endDate, thresholdsMs));
    }, [startDate, endDate, thresholdsMs]);

    return timeLeft;
};

export default useCountdownTimer;
