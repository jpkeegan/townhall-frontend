import { useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { addUser, User } from "../requests/user-requests";
import "../styles/registration-styles.css";

type UserForm = {
    username: string,
    password: string,
    confirmPassword: string,
    first_name: string,
    last_name: string,
    role: string,
    profile_pic: string
};

export function RegistrationPage(){
    const navigate = useNavigate();
    const [form, setForm] = useState<UserForm>({
        username: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        role: "Stormtrooper",
        profile_pic: ""
    });
    const queryClient = useQueryClient();

    const addUserMutation = useMutation(addUser, {
        onSuccess: () => queryClient.invalidateQueries("usercache")
    });

    function isFormValid(){
        if(!form.username || !form.password || !form.confirmPassword || !form.first_name || !form.last_name || !form.profile_pic) {
            alert("Please fill in all the fields");
            return;
        }
        if(form.password.length < 10 || !/[!@#$%^&*(),.?":{}|<>]/.test(form.password)){
            alert("Password must: Be atleast 10 characters long and Contain 1 special character");
            return;
        }
        if(form.password !== form.confirmPassword){
            alert("Passwords must match");
            return;
        }
        return true;
    };

    const handleSubmit = async(event: React.FormEvent) => {
        if(!isFormValid()){
            return;
        }
        event.preventDefault();
        const newUser: Omit<User, "user_id"> = {
            username: form.username,
            password: form.password, 
            first_name: form.first_name, 
            last_name: form.last_name, 
            role: "Stormtrooper", 
            profile_pic: form.profile_pic,
        };
        try{
            await addUserMutation.mutateAsync(newUser);
            navigate("/");
        }catch(error){
            alert("Registration failed");
        }
    };

    return (
        <div className="registration-page">

            <form className="form-container" onSubmit={handleSubmit}>
            <h1>Register</h1>
            <label>
                Username
                <input type="text" onChange={(e) => setForm({...form, username:e.target.value})}/>
            </label>
            <label>
                Password
                <input type="password" onChange={(e) => setForm({...form, password:e.target.value})}/>
            </label>
            <label>
                Confirm Password
                <input type="password" onChange={(e) => setForm({...form, confirmPassword:e.target.value})}/>
            </label>
            <label>
                First Name
                <input type="text" onChange={(e) => setForm({...form, first_name:e.target.value})}/>
            </label>
            <label>
                Last Name
                <input type="text" onChange={(e) => setForm({...form, last_name:e.target.value})}/>
            </label>
            <label>
                Profile Picture
                <input type="text" onChange={(e) => setForm({...form, profile_pic:e.target.value})}/>
            </label>
                <button type="submit">Register</button>
                <button onClick={() => navigate("/")}>Sign In</button>
            </form>

        </div>
    );
};