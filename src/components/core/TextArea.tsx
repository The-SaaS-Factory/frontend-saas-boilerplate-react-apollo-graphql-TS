/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};
const formats = ["header", "bold", "italic", "underline", "indent", "list"];

const TextArea = ({
  onChange,
  contentText,
}: {
  onChange: any;
  onFocus: any;
  onBlur: any;
  contentText: any;
  rows: any;
}) => {
  const [text, setText] = useState(contentText);

  useEffect(() => {
    typeof contentText;
    if (typeof contentText === "undefined") {
      setText("");
    } else {
      setText(contentText);
    }
  }, [contentText]);

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={text}
        onChange={(value) => {
          onChange(value);
        }}
        modules={modules}
        className="h-48"
        formats={formats}
      />
    </div>
  );
};

export default TextArea;
