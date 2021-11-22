import React, { Fragment } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid, InputLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
const CreateCandidate = ({ open, item }) => {
    console.log(item)
    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'lg'}
        >
            <DialogTitle id="alert-dialog-title" style={{ width: "100%", textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>Hồ sơ ứng viên</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                        <Typography variant="h3" gutterBottom align="center">
                            Thông tin cơ bản
                        </Typography>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item xs={12} md >
                        <Typography variant="h3" gutterBottom align="center">
                            Thông tin tuyển dụng
                        </Typography>
                        <TextField
                            id="outlined-read-only-input"
                            label="Vị trí tuyển dụng"
                            defaultValue="Marketing"
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />
                        <TextField
                            id="outlined-read-only-input"
                            label="Read Only"
                            defaultValue="Hello World"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCandidate
