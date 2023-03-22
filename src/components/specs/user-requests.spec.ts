import { User, login, getAllUsers, LoginData, getUsersByRole, addUser, updateUser, deleteUser } from '../requests/user-requests';
import nock from "nock";

describe('User API Requests', () => {
    const API_BASE_URL = 'http://localhost:3000'; // Replace with your actual API base URL

    let testUser: User;

    beforeAll(async () => {
        const testUserData = {
            username: "LichKing",
            password: "password",
            first_name: "Arthus",
            last_name: "Menethil",
            role: "user",
            profile_pic: "test"
        };

        nock(API_BASE_URL)
            .post('/users')
            .reply(201, {
                user_id: '1',
                ...testUserData
            });

        testUser = await addUser(testUserData);
    });

    afterAll(async () => {
        nock(API_BASE_URL)
            .delete(`/users/${testUser.user_id}`)
            .reply(200);

        await deleteUser(testUser.user_id);
    });

    test("getAllUsers", async () => {
        nock(API_BASE_URL)
            .get('/users')
            .reply(200, [testUser]);

        const users = await getAllUsers();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
    });

    test("login", async () => {
        const mockLogin: LoginData = {
            username: "LichKing",
            password: "password",
        };

        nock(API_BASE_URL)
            .post('/login')
            .reply(200, testUser);

        const testLogin = await login(mockLogin);
        expect(testLogin.username).toEqual(testUser.username);
    });

    test("getUsersByRole", async () => {
        const role = "user";

        nock(API_BASE_URL)
            .get(`/users/role/${role}`)
            .reply(200, [testUser]);

        const users = await getUsersByRole(role);
        expect(users.length).toBeGreaterThan(0);
    });

    test("addUser", async () => {
        const newUserData = {
            username: "lJenkins",
            password: "password",
            first_name: "Leeroy",
            last_name: "Jenkins",
            role: "COUNCIL",
            profile_pic: "test"
        };

        nock(API_BASE_URL)
            .post('/users')
            .reply(201, {
                user_id: '2',
                ...newUserData
            });

        const newUser = await addUser(newUserData);
        expect(newUser.user_id).toBeDefined();
        expect(newUser.username).toBe(newUserData.username);

        nock(API_BASE_URL)
            .delete(`/users/${newUser.user_id}`)
            .reply(200);

        await deleteUser(newUser.user_id);
    });

    test("updateUser", async () => {
        const updatedUserData = {
            user_id: testUser.user_id,
            username: "lJenkins",
            password: "password",
            first_name: "LEEROY",
            last_name: "Jenkins",
            role: "COUNCIL",
            profile_pic: "test"
        };

        nock(API_BASE_URL)
            .put(`/users/${testUser.user_id}`)
            .reply(200, {
                ...updatedUserData
            });

        const updatedUser = await updateUser(testUser.user_id, updatedUserData);
    expect(updatedUser.first_name).toBe(updatedUserData.first_name);
    expect(updatedUser.user_id).toBe(testUser.user_id);
    });
});
