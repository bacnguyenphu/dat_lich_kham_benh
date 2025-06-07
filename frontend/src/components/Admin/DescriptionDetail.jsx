import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw,ContentState  } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs"
import { useEffect, useState } from "react";

function DescriptionDetail({ type, payload, setPayload }) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onEditorStateChange = (newState) => {
        setEditorState(newState);
        const rawContent = convertToRaw(newState.getCurrentContent());
        setPayload({ ...payload, description_detail: draftToHtml(rawContent) })
    };

    useEffect(() => {
        if (type !== "ADD") {
            // const html = payload.description_detail;
            const html = "<p>Xin chào <strong>thế giới</strong>!</p>";
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(
                    contentBlock.contentBlocks,
                    contentBlock.entityMap
                );
                const newEditorState = EditorState.createWithContent(contentState);
                setEditorState(newEditorState);
            }
        }

    }, []);

    return (
        <div className="prose">
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="w-[1024px] border p-2"
                editorClassName="min-h-72 border p-2 overflow-auto"
                onEditorStateChange={onEditorStateChange}
            />
        </div>
    );
}

export default DescriptionDetail;