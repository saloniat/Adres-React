import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";

const TextEditor = ({
    name,
    control,
    className = "",
    defaultValue,
    handleChange,
    placeholder = "",
    ...props
}) => {
    const quillRef = useRef(null);
    const lang = useSelector((state) => state.translation.lang);
    useEffect(() => {
        const editor = quillRef.current?.getEditor();
        if (editor) {
            editor.format("direction", lang === "ar" ? "rtl" : "");
            editor.format("align", lang === "ar" ? "right" : "");
            editor.root.style.textAlign = lang === "ar" ? "right" : "";
        }
    }, [lang]);

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field: { onChange, value } }) => (
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    className={className}
                    placeholder={placeholder}
                    onChange={(data) => {
                        onChange(data);
                        if (handleChange) handleChange(data);
                    }}
                />
            )}
        />
    );
};

export default TextEditor;
