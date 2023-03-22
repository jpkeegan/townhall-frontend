import { url } from "./url";



export type User = {
    user_id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    role: string,
    profile_pic: string
};

export type LoginData = {
    username: string,
    password: string
};

export const getAllUsers = async(): Promise<User[]> =>{
    const response = await fetch(`${url}/users`);
    const users = await response.json();
    return users;
};

export const login = async(loginInfo: LoginData): Promise<User> => {
    const response = await fetch(`${url}/login`,{
        method: "PATCH", 
        headers:{"Content-type":"application/json"},
        body: JSON.stringify(loginInfo)
    });
    const user = await response.json();
    console.log(`login response: ${JSON.stringify(user)}`);
    return user;
};

export const getUsersByRole = async(role: string): Promise<User[]> =>{
    const response = await fetch(`${url}/users/${role}`);
    const users = await response.json();
    return users;
};

export const addUser = async(user: Omit<User, 'user_id'>): Promise<User> => {
    const response = await fetch(`${url}/users`,{
        method: "POST", 
        headers:{"Content-type":"application/json"},
        body: JSON.stringify(user)
    });
    const newUser = await response.json();
    return newUser;
};

export const updateUser = async(user_id: number, user: Partial<User>): Promise<User> =>{
    const response = await fetch(`${url}/user/${user_id}`, {
        method: 'PUT', headers: { "Content-Type": "application/json"}, body: JSON.stringify(user)});
    const updatedUser = await response.json();
    return updatedUser;
};

export const deleteUser = async(user_id:number): Promise<boolean> => {
    const response = await fetch(`${url}/user/${user_id}`, {
        method: 'DELETE', headers: { "Content-Type": "application/json"}});
    return response.ok;
};

