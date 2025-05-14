import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useState } from "react";

function DescriptionDetail({html, setHtml}) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onEditorStateChange = (newState) => {
        setEditorState(newState);
        const rawContent = convertToRaw(newState.getCurrentContent());
        setHtml( draftToHtml(rawContent))
    };

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