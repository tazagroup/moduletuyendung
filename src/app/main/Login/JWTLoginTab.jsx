import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { submitLogin } from 'app/auth/store/loginSlice';
import * as yup from 'yup';
import _ from '@lodash';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    email: yup.string().email('You must enter a valid email').required('You must enter a email'),
    password: yup
        .string()
        .required('Please enter your password.')
        .min(4, 'Password is too short - should be 4 chars minimum.'),
});

const defaultValues = {
    email: '',
    password: '',
};

function JWTLoginTab(props) {
    const dispatch = useDispatch();
    const login = useSelector(({ auth }) => auth.login);
    const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
        mode: 'onBlur',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

    const [showPassword, setShowPassword] = useState(false);

    function onSubmit(e) {
        console.log(e)
    }

    return (
        <div className="w-full">
            <form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16"
                    aria-label="LOG IN"
                    disabled={_.isEmpty(dirtyFields) || !isValid}
                    value="legacy"
                >
                    Login
                </Button>
            </form>
        </div>
    );
}

export default JWTLoginTab;
