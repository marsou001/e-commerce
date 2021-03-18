import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    root: {
        maxWidth: '100%'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', 
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    cardContent: {
        display: 'flex',
        [theme.breakpoints.up('xs')]: {
            flexDirection: 'column'
        },
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    },
    productPrice: {
        [theme.breakpoints.up('sm')]: {
            fontSize: '1rem'
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '1.5rem'
        }
    }
}));