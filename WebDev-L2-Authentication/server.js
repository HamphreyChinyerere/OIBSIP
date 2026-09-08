const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const publicDirectory = path.join(
    __dirname,
    "public"
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
    express.static(publicDirectory)
);

app.get(
    "/api/health",
    (request, response) => {
        response.status(200).json({
            success: true,
            message: "AuthFlow server is running"
        });
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
            message: "Route not found"
        });
    }
);

app.listen(
    PORT,
    () => {
        console.log(
            `AuthFlow running on http://localhost:${PORT}`
        );
    }
);