import styled from 'styled-components'

const index = () => {
    return (
        <Container>
            <img
                src='https://i.pinimg.com/originals/25/ef/28/25ef280441ad6d3a5ccf89960b4e95eb.gif'
                alt={"loading"}
            />
        </Container>
    )
}

export default index

const Container= styled.div`
display:flex;
align-items: center;
justify-content: center;
height:100vh;
width:100vw;
`;