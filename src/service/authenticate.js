const users = [
    {
        id: 'user-1',
        username: 'portainer',
        password: 'portainer123',
        email: 'portainer@example.com',
        name: 'Portainer Io'
    }
]


export function authenticate(username, password) {
    const user = users.find((user)=> user.username === username && user.password === password);
    if(!user)
        return null;
    return user;
}

export async function findAccount(ctx, id){
    const user = users.find((u) => u.id === id);
    if(!user){
        return undefined;
    }

    return {
        accountId: user.id,
        async claims(){
            return{
                sub: user.id,
                email: user.email,
                name: user.name
            }
        }
    }
}