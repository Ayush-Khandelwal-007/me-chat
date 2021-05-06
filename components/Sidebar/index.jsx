import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Input, Menu, MenuItem } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ChatIcon from '@material-ui/icons/Chat'
import SearchIcon from '@material-ui/icons/Search'
import * as EV from 'email-validator'
import AddNewChat from './AddNewChat'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db ,storage} from '../../firebase'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ChatBar from './ChatBar'
import FileUpload from '../FileUpload'

const index = () => {
    const [user] = useAuthState(auth);
    const [porfilePic,setProfilePic]=useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [enabled, setEnabled] = useState(false);
    const [loading,setLoading]=useState(false);
    const [openAddProjectDialog, setOpenAddProjectDialog] = useState(false);

    const upload = () => {
        const uploadTask = storage.ref(`ProfilePics/${user.uid}`).put(selectedFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
            },
            (error) => {
              console.log(error);
            },
            () => {
              storage
                .ref("ProfilePics")
                .child(user.uid)
                .getDownloadURL()
                .then((url) => {
                  db.collection("users").doc(user.uid).set({
                    profileURL:url
                  },{merge:true});
                  setLoading(false);
                  setEnabled(false);
                  setSelectedFile(null);
                  setOpenAddProjectDialog(false);
                });
            }
          );
    }

    useEffect(()=>{
        db.collection('users').doc(user.uid).get().then((doc)=>{setProfilePic(doc.data().profileURL?(doc.data().profileURL):(user.email[0].toLowerCase()))})
    })

    const ImageContainer = styled.div`
            padding:50px;
            background-color:#e52165;
            >div{
                height:350px;
                width:350px;
                border-radius:50%;
                border:2px solid #64f264;
                background:url(${porfilePic});
                background-repeat:no-repeat;
                background-size:100% 100%;
                background-position:center center;

                >img{
                    position: absolute;
                    height: 60px;
                    width: 60px;
                    bottom: 130px;
                    right: 65px;
                    cursor: pointer;
                }
                }
            `;

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
            <Dialog open={openAddProjectDialog}>
                <DialogTitle id="form-dialog-title">Select new Profile Pic</DialogTitle>
                <Divider />
                <DialogContent>
                    {
                        loading === true ? (<div style={{ width: "60vw" }}>LOADING...</div>) : (
                            <FileUpload setSelectedFile={setSelectedFile} setEnabled={setEnabled} selectedFile={selectedFile} enabled={enabled} />
                        )
                    }

                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button disabled={loading} onClick={() => { setOpenAddProjectDialog(false) }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { upload() }} disabled={(!enabled) || (loading)} color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                onClose={handleCloseDialog}
                aria-labelledby="customized-dialog-title"
                open={openDialog}
            >
                <DialogTitle
                    classes={{
                        root: 'dialoghf'
                    }}
                    id="customized-dialog-title"
                    onClose={handleCloseDialog}
                >
                    ProfilePic
                </DialogTitle>
                <ImageContainer>
                    <div><img onClick={() => { setOpenAddProjectDialog(true) }} src='/plus.svg' /></div>
                </ImageContainer>
                <DialogActions
                    classes={{
                        root: 'dialoghf'
                    }}
                >
                    <Button autoFocus onClick={handleCloseDialog} color="primary">
                        Close
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
                <StyledAvatar onClick={handleClickOpenDialog} src={porfilePic} />
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