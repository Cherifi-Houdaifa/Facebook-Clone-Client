export async function logout() {
    const { url } = process.env.SERVER_URL;
    const response = await fetch(url + "/auth/logout", {
        ...fetchOptions,
        method: "GET",
    });
    return true;
}

export const fetchOptions = {
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
};

export async function getCurrentUser() {
    const { url } = process.env.SERVER_URL;
    const userResponse = await fetch(url + "/users/current", {
        ...fetchOptions,
        method: "GET",
    });
    if (responseValidator(userResponse) !== true) {
        return;
    }
    const userData = await userResponse.json();

    const friendsRequestsResponse = await fetch(url + "/users/friends/", {
        ...fetchOptions,
        method: "GET",
    });
    if (responseValidator(friendsRequestsResponse) !== true) {
        return;
    }
    const friendsRequestsData = await friendsRequestsResponse.json();

    const results = await Promise.all(
        friendsRequestsData.friendRequests.map((friendid) =>
            fetch(url + "/users/" + friendid, {
                ...fetchOptions,
                method: "GET",
            })
        )
    );
    const friends = await Promise.all(results.map((result) => result.json()));

    let user = {
        ...userData.user,
        requests: [...friends],
    };
    return user;
}
export function responseValidator(fetchResponse) {
    const { url } = process.env.SERVER_URL;
    if (fetchResponse.status === 401) {
        logout();
        sessionStorage.clear();
        location.pathname = "/auth";
        return false;
    }
    if (fetchResponse.status === 400) {
        return false;
    }
    if (fetchResponse.status === 500) {
        return false;
    }
    return true;
}
export async function getPosts(userid, skip) {
    const { url } = process.env.SERVER_URL;
    const response = await fetch(
        url + `/posts?skip=${skip}${userid ? `&userid=${userid}` : ""}`,
        {
            ...fetchOptions,
            method: "GET",
        }
    );
    if (responseValidator(response) !== true) {
        return;
    }
    const posts = await response.json();
    posts.forEach((post) => {
        if (post.img) {
			post.imgMime = getImgMime(post.img);
        }
    });
    return posts;
}
export function isValidUrl(url) {
    return new RegExp(
        "^(https?:\\/\\/)?" +
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
            "((\\d{1,3}\\.){3}\\d{1,3}))" +
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
            "(\\?[;&a-z\\d%_.~+=-]*)?" +
            "(\\#[-a-z\\d_]*)?$",
        "i"
    ).test(url);
}
export function getImgMime(img) {
    if (img.startsWith("iVBORw0KGgo=")) {
        // png
        return "image/png";
    } else if (img.startsWith("/9j/")) {
        // jpeg
        return "image/jpeg";
    } else if (img.startsWith("R0lGODlh") || img.startsWith("R0lGODdh")) {
        // gif
        return "image/gif";
    }
}
