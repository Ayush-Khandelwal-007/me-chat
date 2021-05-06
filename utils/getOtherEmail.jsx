const getOtherEmail = (users,logedInEmail) =>  users?.filter((user)=>user!==logedInEmail)[0]


export default getOtherEmail
