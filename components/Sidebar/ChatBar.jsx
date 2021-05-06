import { Avatar } from '@material-ui/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components'
import { auth, db } from '../../firebase';
import getOtherEmail from '../../utils/getOtherEmail';
import {useRouter} from 'next/router';

const ChatBar = ({ id, users }) => {

    const router = useRouter();

    const [user] = useAuthState(auth);

    const otherEmail = getOtherEmail(users, user.email);
    const refrenaceToRecipient = db.collection('users').where('email', "==", getOtherEmail(users, user.email))

    const [recipientSnapshot] = useCollection(refrenaceToRecipient)

    const recipientInfo = recipientSnapshot?.docs?.[0]?.data();

    const goToChat =()=>{
        router.push(`/chat/${id}`)
    }

    return (
        <Container onClick={goToChat}>
            {recipientInfo ? (
                <UserAvatar src={recipientInfo?.profileURL} />
            ) : (
                <UserAvatar>{otherEmail[0].toUpperCase()}</UserAvatar>
            )}
            <p onClick={() => console.log(users)}>{otherEmail}</p>
        </Container>
    )
}

export default ChatBar

const Container = styled.div`
display:flex;
align-items: center;
justify-content:flex-start;
gap:10px;
padding:10px;
cursor: pointer;
word-break:break-word;
:hover{
    background-color:#c0ebff;
}
`;

const UserAvatar = styled(Avatar)`
margin:5px;
`;