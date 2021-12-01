import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';



export default function BasicCard() {

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography sx={{ fontSize: 15 }} color="text.secondary" gutterBottom>
          Phỏng vấn vòng 1
        </Typography>
        <Typography sx={{ fontSize: 15 }} color="text.secondary" gutterBottom>
          Người thực hiện : Phạm Chí Kiệt
        </Typography>
      </CardContent>
    </Card>
  )
}