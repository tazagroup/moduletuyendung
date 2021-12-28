import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { Document, Page } from 'react-pdf'
const styleButton = {
    cursor: "pointer",
    position: "absolute",
    top: "20px",
    right: "20px"
}
const ViewFile = ({ open, handleClose, item }) => {
    const [numPages, setNumPages] = useState(null);
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'lg'}
            scroll="paper"
        >
            <CloseIcon style={styleButton} onClick={handleClose} />
            <DialogContent>
                <Document
                    file={item}
                    options={{ workerSrc: "./pdf.worker.js" }}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                </Document>
            </DialogContent>
        </Dialog>
    )
}

export default ViewFile
