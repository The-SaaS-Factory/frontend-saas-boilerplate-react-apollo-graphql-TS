import { RefObject, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const TextArea = ({ onChange, onFocus, onBlur, contentText, rows }) => {
  const { t } = useTranslation("misc");

  const [text, setText] = useState(contentText);

  const textareaRef: RefObject<HTMLTextAreaElement> = useRef(null);

  const handleTextarea = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(()=> {
    typeof(contentText);
    if(typeof(contentText) === 'undefined'){
      setText('');
    }else{
      setText(contentText);
    }
  },[contentText])

  
  return (
    <div>
      <textarea
        ref={textareaRef}
        rows={rows}
        onFocus={() => onFocus}
        onBlur={() => onBlur}
        onChange={(e) => {
          handleTextarea(e);
          onChange(e.target.value);
        }}
        value={text}
        className="input-text"
        placeholder={""}
      />
    </div>
  );
};

export default TextArea;
