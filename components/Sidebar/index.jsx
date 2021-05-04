import { Avatar, Button, IconButton } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ChatIcon from '@material-ui/icons/Chat'
import SearchIcon from '@material-ui/icons/Search'
import * as EV from 'email-validator'
import AddNewChat from './AddNewChat'
import useAuthState from 'react-firebase-hooks/auth'
import {auth, db} from '../../firebase'

const index = () => {
    const  [user]=useAuthState(auth);
    const [openNewChatDialog, setOpenNewChatDialog] = React.useState(false);
    const [newChatMail, setNewChatMail] = React.useState("");

    const handleClickOpen = () => {
        setOpenNewChatDialog(true);
    };

    const handleClose = () => {
        setOpenNewChatDialog(false);
    };

    const createChat = () => {
        if(EV.validate(newChatMail)){
            db.collection('chats').add({
                users:[user.email,input]
             })
        }
        else{

        }
    }
    const signOut = () => {
        auth.signOut();
    }

    return (
        <Conatiner>
            <AddNewChat
                openNewChatDialog={openNewChatDialog}
                handleClose={handleClose}
                newChatMail={newChatMail}
                setNewChatMail={setNewChatMail}
                createChat={createChat}
            />
            <Header>
                <StyledAvatar />
                <ItemContainer>
                    <IconButton><ChatIcon /></IconButton>
                    <IconButton><MoreVertIcon /></IconButton>
                </ItemContainer>
            </Header>
            <SearchBar>
                <SearchIcon />
                <SearchInput placeholder={`Search in your Chats`}></SearchInput>
            </SearchBar>
            <StartNewButton onClick={handleClickOpen}>{'Start New Chat'}</StartNewButton>
        </Conatiner>
    )
}

export default index

const Conatiner = styled.div`
width:350px;
`;

const Header = styled.div`
display: flex;
align-items: center;
justify-content:space-between;
position:sticky;
top:0;
background-color:white;
z-index:2;
padding:10px;
border-bottom: 1px solid whitesmoke;
border-radius: 0px 0px 5px 5px;
`;

const StyledAvatar = styled(Avatar)`
cursor: pointer;
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

const SearchInput = styled.input`
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