import React from "react";
import { FileUploader } from "react-drag-drop-files";
const MediaUpload = ({ name, types, multiple, disabled, handleChange }) => {
    return (
        <>
            <FileUploader
                handleChange={handleChange}
                name={name}
                types={types}
                multiple={multiple}
                disabled={disabled}
            />
        </>
    );
};
export default MediaUpload;
