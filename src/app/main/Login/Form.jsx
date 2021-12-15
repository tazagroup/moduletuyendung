import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from "react-router-dom"
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { handleLogin } from 'app/store/fuse/userSlice';
// REACT-HOOK-FORM 
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
//MUI
import { TextField } from '@material-ui/core';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import _ from '@lodash';
// COMPONENTS 
import Swal from "sweetalert2"
// AXIOS 
import axios from "axios"
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    username: yup.string().required('Vui lòng nhập tài khoản'),
    password: yup
        .string()
        .required('Vui lòng nhập mật khẩu.')
});

const defaultValues = {
    username: '',
    password: '',
};

function LoginForm(props) {
    const [showPassword, setShowPassword] = useState(false);
    const user = JSON.parse(localStorage.getItem("profile"))
    const isLoginFlag = user?.isLogin
    const form = useForm({
        mode: 'all',
        defaultValues,
        resolver: yupResolver(schema),
    });
    async function onSubmit(e) {
        const response = await axios.post(`https://tazagroup.vn/index.php?option=com_users&task=user.loginAjax&username=${e.username}&password=${e.password}&format=json`)
        //7 days
        let profile = response.data.User
        if (response.data.loggedIn == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Đăng nhập thất bại',
                text: 'Tài khoản hoặc mật khẩu không đúng !',
            })
        }
        else if (JSON.parse(profile.Profile).PQTD == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Đăng nhập thất bại',
                text: 'Bạn không có quyền truy cập!',
            })
        }
        else {
            const info = JSON.parse(profile.Profile)
            // 3 days
            const user = { isLogin: response.data.loggedIn === 1 ? true : false, profile: { ...info, id: profile.id }, expire: new Date().getTime() + 3 * 24 * 3600 }
            localStorage.setItem("profile", JSON.stringify(user))
            document.location.reload(true)
        }
    }
    if (isLoginFlag) return <Redirect to="/" />
    return (
        <div className="w-full">
            <form className="flex flex-col justify-center w-full" onSubmit={form.handleSubmit(onSubmit)}>
                <Controller
                    name="username"
                    control={form.control}
                    render={(props) => {
                        const { invalid, error } = props.fieldState;
                        return ((
                            <TextField
                                {...props.field}
                                className="mb-16"
                                label="Tài khoản"
                                type="text"
                                error={invalid}
                                helperText={error?.message}
                                variant="outlined"
                                required
                                style={{ marginTop: "15px" }}
                            />
                        ))
                    }}
                />
                <Controller
                    name="password"
                    control={form.control}
                    render={(props) => {
                        const { invalid, error } = props.fieldState;
                        return ((
                            <TextField
                                {...props.field}
                                className="mb-16"
                                label="Mật khẩu"
                                type="password"
                                error={invalid}
                                helperText={error?.message}
                                variant="outlined"
                                InputProps={{
                                    className: 'pr-2',
                                    type: showPassword ? 'text' : 'password',
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} size="large">
                                                <Icon className="text-20" color="action">
                                                    {showPassword ? 'visibility' : 'visibility_off'}
                                                </Icon>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                required
                                style={{ marginTop: "15px" }}
                            />
                        ))
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-15"
                    aria-label="LOG IN"
                    disabled={!form.formState.isValid}
                    value="legacy"
                    size="large"
                >
                    Đăng nhập
                </Button>
            </form>
        </div>
    );
}

export default LoginForm;
