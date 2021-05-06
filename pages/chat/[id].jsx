import styled from 'styled-components';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar'
import ChatScreen from '../../components/ChatScreen'
import { db } from '../../firebase';

const Chat = ({chat,messages}) => {
    return (
        <Container>
            <Head>
                <title>Chat</title>
            </Head>
            <Sidebar />
            <ChatScreenContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatScreenContainer>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context) {
    const ref = db.collection('chats').doc(context.query.id);
    const messagesRef = await ref.collection('messages').orderBy('timestamp', "asc").get();

    const messages = messagesRef.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map((message) => ({
        ...message,
        timestamp: message.timestamp.toDate().getTime()
    }))

    const chatRef=await ref.get();
    const chat = {
        id:chatRef.id,
        ...chatRef.data()
    }

    return ({
        props:{
            messages:JSON.stringify(messages),
            chat:JSON.stringify(chat)
        }
    })
}

const Container = styled.div`
display:flex;
align-items: flex-start;
justify-content: flex-start;
`;

const ChatScreenContainer = styled.div`
flex: 1;
overflow:scroll;
border-left:1px solid #5d057b;
max-width:calc(100vw - 400px);
min-width:calc(100vw - 400px);
height:100vh;
    ::-webkit-scrollbar{
        display:none;
    }
    -ms-overflow-style:none;
    scrollbar-width:none;
`;