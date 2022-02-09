import React from 'react'
import { storage } from "../../services/firebaseService/fireBase"
import { Editor } from '@tinymce/tinymce-react';
const Tinymce = (props) => {
    const { value, onChange, label, disabled = false } = props;
    const [isLoading, setIsLoading] = React.useState(false)
    return (
        <>
            <Editor
                apiKey="1cdi3qs7qw7nogvpu6poxqc6z7bf4a4hurwyao0kdbd741dl"
                value={value}
                disabled={isLoading || disabled}
                init={{
                    placeholder: `Nhập ${label} `,
                    height: "480",
                    menubar: false,
                    branding: false,
                    elementpath: false,
                    a11y_advanced_options: true,
                    plugins: [
                        'advlist autolink lists link image',
                        'charmap print preview anchor help',
                        'searchreplace visualblocks code',
                        'insertdatetime media table paste wordcount'
                    ],
                    file_picker_callback: function (cb, value, meta) {
                        var input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.onchange = function () {
                            setIsLoading(true)
                            var file = this.files[0];
                            const uploadFile = storage.ref(`files/${file.name}`).put(file);
                            uploadFile.on("state_changed", (snapshot) => {
                            },
                                (error) => console.log(error),
                                () => {
                                    storage.ref("files").child(file.name).getDownloadURL().then((url) => {
                                        cb(url)
                                        setIsLoading(false)
                                    })
                                })
                        };
                        input.click();
                    },
                    toolbar:
                        'undo redo | image | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | help'
                }}
                onEditorChange={onChange}
            />
        </>
    )
}

export default Tinymce
