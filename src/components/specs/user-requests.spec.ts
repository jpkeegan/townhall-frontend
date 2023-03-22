import { User, login, getAllUsers, LoginData, getUsersByRole, addUser, updateUser, deleteUser } from '../requests/user-requests';


describe('User API Requests', () => {
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
      testUser = await addUser(testUserData);
    });
  
    afterAll(async () => {
      await deleteUser(testUser.user_id);
    });

    test("getAllUsers", async () => {
        const users = await getAllUsers();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
    });

    test("login", async () => {

        const mockLogin: LoginData = {
            username: "LichKing",
            password: "password",
        };

        const testLogin = await login(mockLogin);
        expect(testLogin.username).toEqual(testUser.username);
    });

    test("getUsersByRole", async () => {
        const role = "user";
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

    const newUser = await addUser(newUserData);
    expect(newUser.user_id).toBeDefined();
    expect(newUser.username).toBe(newUserData.username);
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
    const updatedUser = await updateUser(testUser.user_id, updatedUserData);
    expect(updatedUser.first_name).toBe(updatedUserData.first_name);
    expect(updatedUser.user_id).toBe(testUser.user_id);
    });
});
