import React from 'react'
import { Controller } from "react-hook-form";
import { Editor } from '@tinymce/tinymce-react';
const Tinymce = (props) => {
    const {form,name,label} = props;
    return (
       <>
        <Controller
        name={name}
        control={form.control}
        render={(props) => {
            const {value,onChange} = props.field;
            return (
                <Editor
            apiKey="pwt68f2spsp89axgckzudkmml6j2pp62azv5thtrpjx5gf3d"
            initialValue={value}
            init={{
                height: 200,
                menubar: false,
                branding: false,
                plugins: [
                    'advlist autolink lists link image',
                    'charmap print preview anchor help',
                    'searchreplace visualblocks code',
                    'insertdatetime media table paste wordcount'
                ],
                toolbar:
                    'undo redo | image | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | help'
            }}
            onChange={onChange}
        />
            )
        }}
        />
       </>
    )
}

export default Tinymce
