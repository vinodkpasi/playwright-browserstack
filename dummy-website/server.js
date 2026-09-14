const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3004;

const server = http.createServer((req, res) => {
    const requested = req.url === "/" ? "index.html" : req.url;
    const filePath = path.join(__dirname, requested);

    const contentTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript"
    };

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end("Not Found");
            return;
        }

        res.writeHead(200, {
            "Content-Type": contentTypes[path.extname(filePath)] || "text/plain"
        });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`Dummy website running at http://localhost:${PORT}`);
});
