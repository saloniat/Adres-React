import { useState, useEffect } from "react";

const useIPAddress = (apiUrl = "https://api.ipify.org?format=json") => {
    const [ip, setIP] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the IP only once when the component mounts
        const fetchIP = async () => {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                setIP(data.ip);
            } catch (err) {
                setError("Failed to fetch IP");
                console.error("Error fetching IP:", err);
            }
        };

        fetchIP();
    }, [apiUrl]);

    return { ip, error };
};

export default useIPAddress;
