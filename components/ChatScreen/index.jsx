import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth, db } from '../../firebase';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import { InsertEmoticon } from '@material-ui/icons';
import firebase from 'firebase';
import getOtherEmail from '../../utils/getOtherEmail';
import TimeAgo from 'timeago-react';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

const index = ({ chat, messages }) => {
    const [user] = useAuthState(auth);
    const recipientMail = getOtherEmail(JSON.parse(chat).users, user.email);
    const router = useRouter();
    const endOfMessage = useRef(null);
    const [inputMessage, setInputMessage] = useState('')
    const [messagesSnap] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'asc'));
    const [recipientsSnap] = useCollection(db.collection('users').where("email", "==", recipientMail));
    const [selectEmote, setSelectEmote] = useState(false);

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.replace(/ /g, '') === "") {
            setInputMessage('')
            return
        }

        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })
        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: inputMessage.replace(/ /g, ''),
            user: user.email,
        })
        setInputMessage('')
        scroll();
    }

    const scroll = () => {
        endOfMessage.current.scrollIntoView({
            behaviour: "smooth",
            block: "start",
        })
    }

    useEffect(() => scroll())

    const recipient = recipientsSnap?.docs?.[0]?.data();

    const chatMessages = () => {
        if (messagesSnap) {

            return messagesSnap.docs.map((message) =>
                <Message
                    user={message.data().user}
                    key={message.id}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            )
        }
        else {
            JSON.parse(messages).map((message) =>
                <Message
                    user={message.user}
                    key={message.id}
                    message={message}
                />
            )
        }
    }

    const handleEmote = (emoji, event) => {
        event.preventDefault();
        setInputMessage(inputMessage + `${emoji.native}`)
    }

    return (
        <Container>
            <Header>
                {
                    recipient ? (
                        <Avatar src={recipient?.profileURL} style={{ boxShadow: '0px 0px 8px #4f1919' }} />
                    ) : (
                        <Avatar style={{ boxShadow: '0px 0px 8px #4f1919' }}>{recipientMail[0].toUpperCase()}</Avatar>
                    )
                }
                <UserInfo>
                    <h3>{recipientMail}</h3>
                    {
                        recipientsSnap ? (
                            <div>Last Seen: {" "} {
                                recipient?.lastSeen ? (
                                    <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                                ) : ("Unavailable")
                            }</div>
                        ) : (
                            <div>loading...</div>
                        )
                    }
                </UserInfo>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <ChatSection>
                {chatMessages()}
                <EndOfMessage ref={endOfMessage} />
            </ChatSection>
            <Footer>
                {
                    selectEmote &&
                    <Picker
                        color={'#33fa44'}
                        style={{ width: '100%' }}
                        title='Hola buddies'
                        emojiSize={36}
                        theme={'dark'}
                        set='apple'
                        emoji={'full_moon_with_face'}
                        onClick={handleEmote}
                    />
                }
                <InputBar onSubmit={(e) => sendMessage(e)}>
                    <IconButton onClick={() => setSelectEmote(!selectEmote)}>
                        <InsertEmoticon style={{ color: selectEmote ? ('white') : ("#a9a9a9"), fontSize: "30px" }} />
                    </IconButton>
                    <InputChat onChange={(e) => setInputMessage(e.target.value)} value={inputMessage} placeholder="Type a Message" />
                    <SendButton hidden={inputMessage.replace(/ /g, '') === ''} disabled={inputMessage === ""} type='submit' ><img src={'/logo.png'} /></SendButton>
                </InputBar>
            </Footer>
        </Container>
    )
}

export default index

const Container = styled.div`
display:flex;
flex-direction:column;
background-color:#0d1137;
min-height:100vh;
`;

const Header = styled.div`
position:sticky;
padding:10px;
top:0;
display:flex;
align-items:center;
z-index:2;
background-color:#e52165;
color:#0d1137;
`;

const UserInfo = styled.div`
flex:1;
margin:0px 10px;
 >h3{
     margin:0px;
 }
`;

const HeaderIcons = styled.div``;

const ChatSection = styled.div`
flex:1;
padding:15px;
`;

const EndOfMessage = styled.div`
margin-bottom:50px;
`;

const InputBar = styled.form`
display:flex;
align-items: center;
justify-content:flex-start;
padding:10px;
gap: 10px;
background-color:#181b38;
`;

const Footer = styled.div`
display:flex;
position:sticky;
bottom:0px;
flex-direction:column;
`;

const InputChat = styled.input`
height:40px;
border:none;
border-radius:20px;
font-size:15px;
padding: 0px 20px;
flex:1;
margin-left:10px;
margin-right:10px;
background-color:#15161d;
color:white;
:focus{
    outline:none;
}
`;

const SendButton = styled.button`
background:transparent;
border:none;
overflow:visible;
cursor:pointer;
>img{
    height:40px;
    margin-bottom:-20px;
    overflow:visible;
}
`;