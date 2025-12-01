import sql from "@/lib/db";
import { getUserFromCookie } from "./auth";
import redisClient from "./redis";

export async function insertNewUrl(data: any) {
  const user = await getUserFromCookie();
  console.log("useris: ", user);

  if (!user) {
    return Response.json({ error: "unauthorized" });
  }
  try {
    const { targetUrl, shortCode } = data;
    const existing = await redisClient.sIsMember("shortcode:set", shortCode);
    if (existing) {
      return {
        status: 409,
        msg: "shortcode already exists, try different one!",
      };
    }
    let payload = {
      code: shortCode,
      target: targetUrl,
      clicked: 0,
      last_clicked: null,
      user_id: user.sub,
    };
    console.log("payload: ", payload, Date.now());
    await redisClient.json.ARRAPPEND("url:table", "$.urls", payload);
    await redisClient.sAdd("shortcode:set", shortCode);
    return {
      success: true,
      status: 200,
      response: { code: shortCode, target: targetUrl },
    };
  } catch (error) {
    console.log("error creating slash!!", error);

    return {
      success: false,
      status: 409,
      response: error,
    };
  }

  // try {
  //   await sql`INSERT INTO urls (code, target, user_id) VALUES (${shortCode}, ${targetUrl}, ${user.sub})`;
  //   // await redisClient.json.
  //   return {
  //     success: true,
  //     status: 200,
  //     response: { code: shortCode, target: targetUrl },
  //   };
  // } catch (error) {
  //   return {
  //     success: false,
  //     status: 409,
  //     response: "duplicate shortcode",
  //   };
  // }
}

export async function getAllUrls() {
  const user = await getUserFromCookie();
  if (!user) {
    return Response.json({ error: "unauthorized" });
  }
  const userId = user.sub;
  const response = await redisClient.json.get("url:table", {
    path: `$.urls[?(@.user_id == ${userId})]`,
  });
  return response;
}
export async function incrementClicks(code: string) {
  redisClient.json.numIncrBy(
    "url:table",
    `$.urls[?(@.code == '${code}')].clicked`,
    1
  );
  redisClient.json.set(
    "url:table",
    `$.urls[?(@.code == '${code}')].last_clicked`,
    new Date()
  );
}

// export async function incrementClicks(code: string) {
//   const resp = await sql`
//     UPDATE urls
//     SET clicks = clicks + 1, last_clicked = NOW()
//     WHERE code=${code}
//     RETURNING target
//     `;

//   return resp
// }
export async function getRedirectUrl(code: string) {
  const response = await redisClient.json.get("url:table", {
    path: `$.urls[?(@.code == '${code}')].target`,
  });
  if (!response) {
    return null;
  }
  return response;
}
export async function getStatsByCode(code: string) {
  const response = await redisClient.json.get("url:table", {
    path: `$.urls[?(@.code == '${code}')]`,
  });
  if (!response) {
    return null;
  }
  return response;
}

export async function setRedirectUrlToCache(code: string, target: string) {
  redisClient.set(code, target, {
    expiration: {
      type: "EX",
      value: 60 * 30,
    },
  });
}

export async function getRedirectUrlFromCache(code: string) {
  return await redisClient.get(code);
}
export async function isRedirectUrlExistInCache(code: string) {
  return await redisClient.exists(code);
}

export async function deleteUrlByCode(code: string) {
  try {
    const res = await redisClient.json.del("url:table", {
      path: `$.urls[?(@.code == '${code}')]`,
    });
    console.log("res: ", res);

    if (res !== 1) {
      return {
        success: false,
        status: 404,
        message: "Short code not found",
      };
    }
    return {
      success: true,
      status: 200,
      message: "Deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting URL:", error);
    return {
      success: false,
      status: 500,
      message: "Database error while deleting URL",
      details: error.message,
    };
  }
}
