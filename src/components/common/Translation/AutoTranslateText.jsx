// // import React, { useState, useEffect } from "react";

// // const apiKey = "YOUR_GOOGLE_API_KEY"; // 🔐 Move to env for security

// // const AutoTranslatedText = ({ text, targetLang = "ar" }) => {
// //     const [translated, setTranslated] = useState("");
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         const translate = async () => {
// //             setLoading(true);
// //             try {
// //                 const response = await fetch(
// //                     `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
// //                     {
// //                         method: "POST",
// //                         body: JSON.stringify({ q: text, target: targetLang }),
// //                         headers: { "Content-Type": "application/json" },
// //                     }
// //                 );

// //                 const data = await response.json();
// //                 const translatedText =
// //                     data?.data?.translations?.[0]?.translatedText;
// //                 setTranslated(translatedText || text); // fallback if no translation
// //             } catch (error) {
// //                 console.error("Translation error:", error);
// //                 setTranslated(text); // fallback on error
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         if (text) translate();
// //     }, [text, targetLang]);

// //     return <>{loading ? "Loading..." : translated}</>;
// // };

// // export default AutoTranslatedText;
// import React, { useState, useEffect } from "react";

// const apiKey = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY; // Secure for production use

// const AutoTranslatedText = ({ text, targetLang = "ar" }) => {
//     const [translated, setTranslated] = useState("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const translate = async () => {
//             setLoading(true);
//             try {
//                 const response = await fetch(
//                     `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
//                     {
//                         method: "POST",
//                         body: JSON.stringify({
//                             q: text,
//                             target: targetLang,
//                             source: "auto",
//                         }),
//                         headers: { "Content-Type": "application/json" },
//                     }
//                 );

//                 const data = await response.json();
//                 const detectedLang =
//                     data?.data?.translations?.[0]?.detectedSourceLanguage;
//                 const translatedText =
//                     data?.data?.translations?.[0]?.translatedText;

//                 if (detectedLang === targetLang) {
//                     // Text is already in target language; no need to translate
//                     setTranslated(text);
//                 } else {
//                     setTranslated(translatedText || text);
//                 }
//             } catch (error) {
//                 console.error("Translation error:", error);
//                 setTranslated(text); // Fallback
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (text) translate();
//     }, [text, targetLang]);

//     return <>{loading ? "Loading..." : translated}</>;
// };

// export default AutoTranslatedText;

import React, { useState, useEffect } from "react";
import { franc } from "franc-min"; // Correct import for named export

const apiKey = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY; // 🔐 Secure for production

const AutoTranslatedText = ({ text, targetLang = "ar" }) => {
    const [translated, setTranslated] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const detectLanguage = (text) => {
            // Detect language of the text
            const langCode = franc(text);
            return langCode === "und" ? "en" : langCode; // Default to 'en' if language detection fails
        };

        const translate = async () => {
            const detectedLang = detectLanguage(text);
            // console.log({ detectedLang });
            // If the detected language is the same as the target language, no need to translate
            if (detectedLang === targetLang) {
                setTranslated(text); // Already in the desired language
                setLoading(false);
                return;
            }

            // Proceed with translation if detected language is different
            setLoading(true);
            try {
                const response = await fetch(
                    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
                    {
                        method: "POST",
                        body: JSON.stringify({ q: text, target: targetLang }),
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const data = await response.json();
                const translatedText =
                    data?.data?.translations?.[0]?.translatedText;
                // console.log({ translatedText });
                setTranslated(translatedText || text);
            } catch (error) {
                console.error("Translation error:", error);
                setTranslated(text); // Fallback to original text in case of error
            } finally {
                setLoading(false);
            }
        };

        if (text) translate();
    }, [text, targetLang]);

    return <>{loading ? "Loading..." : translated}</>;
};

export default AutoTranslatedText;
