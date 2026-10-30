import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import { spawn, spawnSync } from "node:child_process";

const root = process.cwd();
const dist = resolve(root, "dist");

function runNpm(args) {
  if (process.platform === "win32") {
    return spawnSync(
      process.env.ComSpec ?? "cmd.exe",
      ["/d", "/s", "/c", `npm ${args.join(" ")}`],
      { cwd: root, stdio: "inherit" },
    );
  }
  return spawnSync("npm", args, { cwd: root, stdio: "inherit" });
}

if (!existsSync(resolve(root, "node_modules"))) {
  console.log("Installing dependencies...");
  const install = runNpm(["install"]);
  if (install.status !== 0) process.exit(install.status ?? 1);
}

console.log("Preparing StayWise...");
const build = runNpm(["run", "build"]);
if (build.status !== 0) process.exit(build.status ?? 1);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
};

const server = createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    let filePath = resolve(dist, relativePath);
    if (!filePath.startsWith(`${dist}${sep}`) && filePath !== dist) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    if (!existsSync(filePath) || pathname === "/") {
      filePath = resolve(dist, "index.html");
    }
    const body = readFileSync(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

let port = Number(process.env.PORT || 4173);
const startPort = port;

server.on("error", (error) => {
  if (error.code === "EADDRINUSE" && port - startPort < 20) {
    port += 1;
    server.listen(port, "127.0.0.1");
    return;
  }
  console.error(error);
  process.exit(1);
});

server.listen(port, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`\nStayWise is running: ${url}`);
  console.log("Close this window to stop the local server.\n");

  if (process.env.NO_OPEN !== "1") {
    if (process.platform === "win32") {
      spawn("cmd", ["/c", "start", "", url], {
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      }).unref();
    } else {
      const opener = process.platform === "darwin" ? "open" : "xdg-open";
      spawn(opener, [url], { detached: true, stdio: "ignore" }).unref();
    }
  }
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
