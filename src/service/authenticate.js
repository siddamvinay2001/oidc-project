const users = [
    {
        id: 'user-1',
        username: 'portainer',
        password: 'portainer123',
        email: 'portainer@example.com',
        name: 'Portainer Io'
    }
]


export async function authenticate(username, password) {
    const user = users.find((user)=> user.username === username && user.password === password);
    if(!user)
        return null;
    return user;
}