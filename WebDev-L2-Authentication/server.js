const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();

const PORT = process.env.PORT || 3000;

const publicDirectory = path.join(
    __dirname,
    "public"
);

const protectedDirectory = path.join(
    __dirname,
    "protected"
);

const usersFile = path.join(
    __dirname,
    "data",
    "users.json"
);

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    session({
        name: "lockr.sid",
        secret:
            process.env.SESSION_SECRET ||
            "lockr-development-session-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure:
                process.env.NODE_ENV ===
                "production",
            maxAge:
                1000 *
                60 *
                60 *
                2
        }
    })
);

app.use(
    express.static(publicDirectory)
);

async function readUsers() {
    try {
        const data = await fs.readFile(
            usersFile,
            "utf8"
        );

        const users = JSON.parse(data);

        return Array.isArray(users)
            ? users
            : [];
    } catch {
        return [];
    }
}

async function writeUsers(users) {
    await fs.writeFile(
        usersFile,
        JSON.stringify(
            users,
            null,
            2
        ),
        "utf8"
    );
}

function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{3,30}$/.test(
        username
    );
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
}

function isValidPassword(password) {
    return (
        typeof password === "string" &&
        password.length >= 8 &&
        /\d/.test(password)
    );
}

function createSessionUser(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email
    };
}

function regenerateSession(request) {
    return new Promise(
        (resolve, reject) => {
            request.session.regenerate(
                (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                }
            );
        }
    );
}

function saveSession(request) {
    return new Promise(
        (resolve, reject) => {
            request.session.save(
                (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                }
            );
        }
    );
}

function destroySession(request) {
    return new Promise(
        (resolve, reject) => {
            request.session.destroy(
                (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                }
            );
        }
    );
}

function requireAuthenticatedPage(
    request,
    response,
    next
) {
    if (
        !request.session ||
        !request.session.user
    ) {
        return response.redirect("/");
    }

    next();
}

app.get(
    "/api/health",
    (request, response) => {
        response.status(200).json({
            success: true,
            message:
                "LOCKR server is running"
        });
    }
);

app.post(
    "/api/register",
    async (request, response) => {
        try {
            const {
                username,
                email,
                password
            } = request.body;

            const normalizedUsername =
                typeof username === "string"
                    ? username.trim()
                    : "";

            const normalizedEmail =
                typeof email === "string"
                    ? email
                        .trim()
                        .toLowerCase()
                    : "";

            if (
                !normalizedUsername ||
                !normalizedEmail ||
                !password
            ) {
                return response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "All registration fields are required."
                    });
            }

            if (
                !isValidUsername(
                    normalizedUsername
                )
            ) {
                return response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Username must be 3 to 30 characters and use only letters, numbers or underscores."
                    });
            }

            if (
                !isValidEmail(
                    normalizedEmail
                )
            ) {
                return response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Enter a valid email address."
                    });
            }

            if (
                !isValidPassword(
                    password
                )
            ) {
                return response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Password must be at least 8 characters and contain a number."
                    });
            }

            const users =
                await readUsers();

            const usernameExists =
                users.some(
                    (user) =>
                        typeof user.username ===
                            "string" &&
                        user.username.toLowerCase() ===
                            normalizedUsername.toLowerCase()
                );

            if (usernameExists) {
                return response
                    .status(409)
                    .json({
                        success: false,
                        message:
                            "Username is already registered."
                    });
            }

            const emailExists =
                users.some(
                    (user) =>
                        typeof user.email ===
                            "string" &&
                        user.email.toLowerCase() ===
                            normalizedEmail
                );

            if (emailExists) {
                return response
                    .status(409)
                    .json({
                        success: false,
                        message:
                            "Email address is already registered."
                    });
            }

            const passwordHash =
                await bcrypt.hash(
                    password,
                    12
                );

            const newUser = {
                id:
                    Date.now() +
                    Math.floor(
                        Math.random() *
                        1000
                    ),
                username:
                    normalizedUsername,
                email:
                    normalizedEmail,
                passwordHash,
                createdAt:
                    new Date()
                        .toISOString()
            };

            users.push(newUser);

            await writeUsers(users);

            return response
                .status(201)
                .json({
                    success: true,
                    message:
                        "Account created successfully.",
                    user:
                        createSessionUser(
                            newUser
                        )
                });
        } catch {
            return response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Unable to create account."
                });
        }
    }
);

app.post(
    "/api/login",
    async (request, response) => {
        try {
            const {
                identifier,
                password
            } = request.body;

            const normalizedIdentifier =
                typeof identifier ===
                    "string"
                    ? identifier
                        .trim()
                        .toLowerCase()
                    : "";

            if (
                !normalizedIdentifier ||
                typeof password !==
                    "string" ||
                !password
            ) {
                return response
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "Invalid username, email or password."
                    });
            }

            const users =
                await readUsers();

            const user =
                users.find(
                    (item) => {
                        const username =
                            typeof item.username ===
                                "string"
                                ? item.username.toLowerCase()
                                : "";

                        const email =
                            typeof item.email ===
                                "string"
                                ? item.email.toLowerCase()
                                : "";

                        return (
                            username ===
                                normalizedIdentifier ||
                            email ===
                                normalizedIdentifier
                        );
                    }
                );

            if (
                !user ||
                typeof user.passwordHash !==
                    "string"
            ) {
                return response
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "Invalid username, email or password."
                    });
            }

            const passwordMatches =
                await bcrypt.compare(
                    password,
                    user.passwordHash
                );

            if (!passwordMatches) {
                return response
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "Invalid username, email or password."
                    });
            }

            await regenerateSession(
                request
            );

            request.session.user =
                createSessionUser(user);

            request.session.loggedInAt =
                new Date().toISOString();

            await saveSession(request);

            return response
                .status(200)
                .json({
                    success: true,
                    message:
                        "Login successful.",
                    user:
                        request.session.user
                });
        } catch {
            return response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Unable to sign in."
                });
        }
    }
);

app.post(
    "/api/logout",
    async (request, response) => {
        try {
            if (
                !request.session ||
                !request.session.user
            ) {
                response.clearCookie(
                    "lockr.sid"
                );

                return response
                    .status(200)
                    .json({
                        success: true,
                        message:
                            "Already logged out."
                    });
            }

            await destroySession(
                request
            );

            response.clearCookie(
                "lockr.sid",
                {
                    httpOnly: true,
                    sameSite: "lax",
                    secure:
                        process.env.NODE_ENV ===
                        "production"
                }
            );

            return response
                .status(200)
                .json({
                    success: true,
                    message:
                        "Logged out successfully."
                });
        } catch {
            return response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Unable to log out."
                });
        }
    }
);

app.get(
    "/api/session",
    (request, response) => {
        if (
            !request.session ||
            !request.session.user
        ) {
            return response
                .status(401)
                .json({
                    success: false,
                    authenticated: false,
                    message:
                        "Authentication required."
                });
        }

        return response
            .status(200)
            .json({
                success: true,
                authenticated: true,
                user:
                    request.session.user,
                loggedInAt:
                    request.session
                        .loggedInAt
            });
    }
);

app.get(
    "/dashboard",
    requireAuthenticatedPage,
    (request, response) => {
        response.sendFile(
            path.join(
                protectedDirectory,
                "dashboard.html"
            )
        );
    }
);

app.get(
    "/",
    (request, response) => {
        response.sendFile(
            path.join(
                publicDirectory,
                "index.html"
            )
        );
    }
);

app.use(
    (request, response) => {
        response.status(404).json({
            success: false,
            message:
                "Route not found"
        });
    }
);

app.listen(
    PORT,
    () => {
        console.log(
            `LOCKR running on http://localhost:${PORT}`
        );
    }
);