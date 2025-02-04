"use client"; // Ensures this component is only rendered on the client

import React, { useRef, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this only runs on the client
  }, []);

  useEffect(() => {
    if (!isClient || quillInstance.current) return; // Prevent re-initialization

    import("quill").then((QuillModule) => {
      if (editorRef.current) {
        const Quill = QuillModule.default; // Get Quill from the module
        quillInstance.current = new Quill(editorRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
              ["link", "image", "video"],
              [{ align: [] }], // Alignment support
              [{ color: [] }, { background: [] }], // Text color & Background color
              [{ script: "sub" }, { script: "super" }], // Subscript & Superscript
              ["code-block"], // Code Block
              ["clean"],
            ],
          },
        });

        quillInstance.current.on("text-change", () => {
          if (quillInstance.current) {
            const html = quillInstance.current.root.innerHTML;
            onChange(html);
          }
        });

        // Set initial value
        if (value) {
          quillInstance.current.clipboard.dangerouslyPasteHTML(value);
        }
      }
    });
  }, [isClient]);

  useEffect(() => {
    if (quillInstance.current) {
      const currentContent = quillInstance.current.root.innerHTML;
      if (currentContent !== value) {
        quillInstance.current.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [value]);

  if (!isClient) return null; // Prevents rendering on the server

  return <div ref={editorRef} />;
};

export default RichTextEditor;
