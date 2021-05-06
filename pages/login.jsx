import styled from 'styled-components'
import Head from 'next/head'
import { Button } from '@material-ui/core'
import { auth, provider } from '../firebase'
 
const Login = () => {

    const SignIn =()=>{
        auth.signInWithPopup(provider).catch((err)=>{
            console.log(err);
            alert;
        });
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo
                    src={"/logoandname.png"}
                    alt={"Loading"}
                />
                <Button variant="outlined" onClick={SignIn}>Sign In With Google</Button>
            </LoginContainer> 
        </Container>
    )
}

export default Login

const Container= styled.div`
display:grid;
place-items:center;
height:100vh;
background-color:whitesmoke;
`;

const LoginContainer = styled.div`
border-radius:8px;
padding:8vh 6vh;
background-color:white;
display :flex;
flex-direction :column;
align-items:center;
justify-content :center;
gap:5vh;
box-shadow:0px 0px 14px -3px rgba(0,0,0,0.7)
`;

const Logo = styled.img`
height:30vh;
`;