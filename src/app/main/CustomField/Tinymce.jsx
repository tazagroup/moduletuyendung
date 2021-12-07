import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
const Tinymce = (props) => {
    const { value, onChange, label } = props;
    return (
        <>
            <Editor
                apiKey="pwt68f2spsp89axgckzudkmml6j2pp62azv5thtrpjx5gf3d"
                value={value}
                init={{
                    placeholder: `Nhập ${label} `,
                    menubar: false,
                    branding: false,
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

                        /*
                          Note: In modern browsers input[type="file"] is functional without
                          even adding it to the DOM, but that might not be the case in some older
                          or quirky browsers like IE, so you might want to add it to the DOM
                          just in case, and visually hide it. And do not forget do remove it
                          once you do not need it anymore.
                        */

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
