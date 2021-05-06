import { Avatar, Button, IconButton, Input, Menu, MenuItem } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ChatIcon from '@material-ui/icons/Chat'
import SearchIcon from '@material-ui/icons/Search'
import * as EV from 'email-validator'
import AddNewChat from './AddNewChat'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db } from '../../firebase'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ChatBar from './ChatBar'

const index = () => {
    const [user] = useAuthState(auth);
    const userChat = db.collection('chats').where('users', 'array-contains', user.email);

    const [chatsSnapShots] = useCollection(userChat);
    const [error, setError] = React.useState('');

    const [openNewChatDialog, setOpenNewChatDialog] = React.useState(false);
    const [newChatMail, setNewChatMail] = React.useState("");
    const [openSnack, setOpenSnack] = React.useState(false);

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack(false);
    };
    const handleClickOpen = () => {
        setOpenNewChatDialog(true);
    };

    const handleClose = () => {
        setOpenNewChatDialog(false);
        setNewChatMail("");
    };

    const chatAlreadyThere = () => chatsSnapShots?.docs.filter((chat) => chat.data().users.includes(newChatMail)).length > 0;

    const createChat = () => {
        if (EV.validate(newChatMail)) {
            if (newChatMail === user.email) {
                setError(`Please don't be so sadist to even chat to yourself.`);
                setOpenSnack(true);
                return
            }
            else if (chatAlreadyThere()) {
                setError(`You have been talking to this person recently, try searching in recent chats.`);
                setOpenSnack(true);
                return
            }
            db.collection('chats').add({
                users: [user.email, newChatMail]
            })
            setNewChatMail("");
            setOpenNewChatDialog(false);
        }
        else {
            console.log("hahahaha")
            setError(`Please enter a valid Emai-Id, try looking for some typos.`);
            setOpenSnack(true);
            return
        }
    };


    const signOut = () => {
        auth.signOut();
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
  

    return (
        <Conatiner>
            <Dialog onClose={handleCloseDialog} aria-labelledby="customized-dialog-title" open={openDialog}>
                <DialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
                    ProfilePic
                </DialogTitle>
                <DialogContent dividers>

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCloseDialog} color="primary">
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnack} autoHideDuration={4000} onClose={handleCloseSnack}>
                <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnack} severity="error" >
                    {error}
                </MuiAlert>
            </Snackbar>
            <AddNewChat
                openNewChatDialog={openNewChatDialog}
                handleClose={handleClose}
                newChatMail={newChatMail}
                setNewChatMail={setNewChatMail}
                createChat={createChat}
            />
            <Header>
                <StyledAvatar onClick={handleClickOpenDialog} src={user.photoURL} />
                <ItemContainer>
                    <IconButton><ChatIcon style={{ color: 'white' }} /></IconButton>
                    <IconButton onClick={handleClickMenu} ><MoreVertIcon style={{ color: 'white' }} /></IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
                        <MenuItem onClick={signOut}>Logout</MenuItem>
                    </Menu>
                </ItemContainer>
            </Header>
            <SearchBar>
                <SearchIcon />
                <SearchInput placeholder={`Search in your Chats`}></SearchInput>
            </SearchBar>
            <StartNewButton onClick={handleClickOpen}>{'Start New Chat'}</StartNewButton>
            {
                chatsSnapShots?.docs.map((chat) => {
                    return (
                        <ChatBar key={chat.id} id={chat.id} users={chat.data().users} />
                    )
                })
            }
        </Conatiner >
    )
}

export default index

const Conatiner = styled.div`
flex:0.45;
width:400px;
height:100vh;
overflow-y:auto;
::-webkit-scrollbar{
        display:none;
    }
    -ms-overflow-style:none;
    scrollbar-width:none;
`;

const Header = styled.div`
display: flex;
align-items: center;
justify-content:space-between;
position:sticky;
top:0;
background-color:#e52165;
z-index:2;
padding:10px;
border-bottom: 1px solid whitesmoke;
`;

const StyledAvatar = styled(Avatar)`
cursor: pointer;
box-shadow:0px 0px 8px #4f1919;
:hover{
    opacity:0.8;
}
`;

const ItemContainer = styled.div`
`;

const SearchBar = styled.div`
display: flex;
align-items: center;
padding:20px;
`;

const SearchInput = styled(Input)`
outline-width:0;
border:none;
flex:1;
`;

const StartNewButton = styled(Button)`
width:100%;
height:40px;
&&&{
    border-bottom:1px solid whitesmoke;
    border-top:1px solid whitesmoke;
}
`;