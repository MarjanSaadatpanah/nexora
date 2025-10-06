
import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

export default function Test() {
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'righ',
    });
    const { vertical, horizontal, open } = state;

    const handleClick = (newState) => () => {
        setState({ ...newState, open: true });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const buttons = (
        <React.Fragment>
            <Grid container sx={{ justifyContent: 'righ' }}>
                <Grid sx={{ textAlign: 'right' }} size={6}>
                    <Button onClick={handleClick({ vertical: 'top', horizontal: 'right' })}>
                        Top-Right
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    );

    return (
        <div className='pt-32'>
            <Box sx={{ width: 500 }}>
                {buttons}
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={open}
                    onClose={handleClose}
                    message="I love snacks"
                    key={vertical + horizontal}
                />
            </Box>
        </div>
    );
}
