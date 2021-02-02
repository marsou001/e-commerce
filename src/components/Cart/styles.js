import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    title: {
        marginTop: '5%',
    },
    emptyButton: {
        minWidth: '150px',
        marginBottom: '5px',
        [theme.breakpoints.up('sm')]: {
            marginBottom: '0',
            marginRight: '20px',
        },        
    },
    checkoutButton: {
        minWidth: '150px',
    },
    link: {
        textDecoration: 'none',
    },
    cardDetails: {
        display: 'flex',
        marginTop: '10%',
        width: '100%',
        justifyContent: 'space-between',
    },
    buttons: {
        [theme.breakpoints.down('xs')]: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
        }
    }
}));