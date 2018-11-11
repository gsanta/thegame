import { withStyles, Button } from '@material-ui/core';
import * as React from 'react';

const styles = {
    root: {
        height: 60,
        width: '100%',
        background: '#993c22',
        '&:hover': {
            background: '#993c22'
        }
    },
  };

const ButtonStyled = (props: ButtonProps) => {
    return (
            <Button
                variant="contained"
                color="primary"
                className={props.classes.root}
                onClick={props.onClick}
            >
                {props.text}
            </Button>
    );
};

export interface ButtonProps {
    text: string;
    classes: {
        root: any;
    };
    onClick(event: React.SyntheticEvent<any>): void;
}

export default withStyles(styles)(ButtonStyled);