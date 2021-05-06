import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../../firebase';
import moment from 'moment';
const Message = ({ user, message }) => {

    const [userloggedin] = useAuthState(auth);

    return (
        <Container>
            {
                user === userloggedin.email ? (
                    <Sender>
                        <span style={{maxWidth:"450px",wordWrap: "break-word"}}>{message.message}</span>
                        <TimeStamp>
                            {
                                message.timestamp ? (moment(message.timestamp).format('LT')) : ('...')
                            }
                        </TimeStamp>
                    </Sender>
                ) : (
                    <Reciever>
                        <span style={{maxWidth:"450px",wordWrap: "break-word"}}>{message.message}</span>
                        <TimeStamp>
                            {
                                message.timestamp ? (moment(message.timestamp).format('LT')) : ('...')
                            }
                        </TimeStamp>
                    </Reciever>
                )
            }
        </Container>
    )
}

export default Message


const Container = styled.div`
width:100%;
display:flex;
`;

const messageElement = styled.p`
color:white;
font-weight:500;
width:fit-content;
font-size:15px;
padding:10px 45px 0px 15px;
max-width:450px;
display:flex;
flex-direction:column;
`;

const Sender = styled(messageElement)`
background-color:#e52165;
margin-left:auto;
border-radius:8px 8px 0px 8px;
`;


const Reciever = styled(messageElement)`
background-color:#433242;
margin-right:auto;
border-radius:0px 8px 8px 8px;
`;

const TimeStamp = styled.span`
font-size:10px;
font-weight:400;
text-align:right;
position:relative;
margin:2px -40px 5px 0px;
color:#d5d5d5
`;