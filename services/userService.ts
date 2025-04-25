import { NewUser } from "../types/User";

export function createUser(newUser: NewUser) {
  console.log(newUser);
  return {};
}

export function login(username: string, passwordHash: string) {
  console.log(username, passwordHash);
  const token = "blah";
  return token;
}

export default {
  createUser,
  login,
};