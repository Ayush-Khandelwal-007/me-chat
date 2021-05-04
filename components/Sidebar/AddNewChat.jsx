import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';

const AddNewChat = ({openNewChatDialog,handleClose,newChatMail,setNewChatMail,createChat}) => {
    return (
        <Dialog open={openNewChatDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">START NEW CHAT</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please Enter an Email Address you want to chat to.
            </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    value={newChatMail}
                    onChange={(e) => setNewChatMail(e.target.value)}
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={createChat} color="primary">
                    Start
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddNewChat
