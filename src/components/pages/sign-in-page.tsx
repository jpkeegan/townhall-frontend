import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, LoginData, User } from "../requests/user-requests";
import "../styles/sign-in-styles.css";

type SignInPageProps = {
    onUserLogin: (user: User) => void;
};

export function SignInPage({onUserLogin}: SignInPageProps) {
    const [username, setUsername] = useState("");
    const [password, setPassowrd] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(event : React.FormEvent) => {
        event.preventDefault();
        const loginInfo: LoginData = {username, password};
        try {
            const user = await login(loginInfo);
            localStorage.setItem("user", JSON.stringify(user));
            onUserLogin(user);
            navigate("/");
        }catch (error){
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="shared-background">
            <div className="form-container">
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" value={username}
                    onChange={(e) => setUsername(e.target.value)}/>
                <input type="password"  placeholder="password" value={password}  
                    onChange={(e) => setPassowrd(e.target.value)}/>
                <button type="submit">Log In</button>
                </form>
                <button onClick={() => navigate("/registration")}>Register</button>
            </div>
        </div>
    );
}