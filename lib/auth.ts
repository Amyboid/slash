import sql from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import redisClient from "./redis";
const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXP = "30m";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
function generateToken(data: any) {
  console.log("generating token: ", data);
  
  return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXP });
}

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function signup(username: string, password: string) {
  try {
    const existing = await redisClient.sIsMember("username:set", username);
    if (existing) {
      return { status: 409, msg: "username already exists" };
    }

    const hashed = await bcrypt.hash(password, 10);
    const userId = await redisClient.INCR("user_id");
    let userdata = {
      user_id: userId,
      username: username,
      password: hashed,
    };
    await redisClient.json.ARRAPPEND("user:table", "$.user", userdata);
    await redisClient.sAdd("username:set", username);
    console.log("userId after signup: ", userId);
    
    const token = generateToken({ sub: userId, username: username });
    return {
      status: 200,
      msg: "sign up successfull",
      user: { id: userId, username: username },
      token,
    };
  } catch (error) {
    console.error("signup error:", error);
    return { status: 500, msg: "signup failed" };
  }
}

export async function login(username: string, password: string) {
  try {
    const rows: Array<any> = await redisClient.json.get("user:table", {
      path: `$.user[?(@.username == '${username}')]`,
    });

    if (!rows || rows.length === 0) {
      return { status: 401, msg: "username not exist" };
    }

    
    const user = rows[0];
    console.log("rows: ", user);
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return { status: 401, msg: "invalid credentials" };
    }
    const token = generateToken({ sub: user.user_id, username: user.username });

    return {
      status: 200,
      msg: "login successful",
      user: { id: user.user_id, username: user.username },
      token,
    };
  } catch (error) {
    console.error("login error:", error);
    return { status: 500, msg: "login failed" };
  }
}

export async function getUserFromCookie() {
  const cookie = (await cookies()).get("session");
  if (!cookie) {
    return null;
  }
  try {
    const token = cookie.value;
    const user = verifyToken(token);
    return user;
  } catch (error) {
    return null;
  }
}
