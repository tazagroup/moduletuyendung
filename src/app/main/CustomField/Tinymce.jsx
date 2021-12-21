import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
const Tinymce = (props) => {
    const { value, onChange, label, disabled = false } = props;
    return (
        <>
            <Editor
                apiKey="1cdi3qs7qw7nogvpu6poxqc6z7bf4a4hurwyao0kdbd741dl"
                value={value}
                disabled={disabled}
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
                            var file = this.files[0];
                            var reader = new FileReader();
                            reader.onload = function () {
                                var id = 'blobid' + (new Date()).getTime();
                                var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                                var base64 = reader.result.split(',')[1];
                                var blobInfo = blobCache.create(id, file, base64);
                                blobCache.add(blobInfo);
                                /* call the callback and populate the Title field with the file name */
                                cb(blobInfo.blobUri(), { title: file.name });
                            };
                            reader.readAsDataURL(file);
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
