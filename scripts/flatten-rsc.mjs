// Next's static export writes some prefetch payloads as nested folders
//   out/sessions/who-am-i/__next.sessions/who-am-i/__PAGE__.txt
// but the client requests the flat name
//   out/sessions/who-am-i/__next.sessions.who-am-i.__PAGE__.txt
// Static hosts like GitHub Pages can't map one to the other, so copy each
// nested payload to its flat name as well.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "out");
let copied = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (!e.isDirectory()) continue;
    if (e.name.startsWith("__next.")) flatten(full, dir, [e.name]);
    else walk(full);
  }
}

function flatten(dir, parent, segs) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) flatten(full, parent, [...segs, e.name]);
    else {
      fs.copyFileSync(full, path.join(parent, [...segs, e.name].join(".")));
      copied++;
    }
  }
}

walk(root);
console.log(`flatten-rsc: copied ${copied} payload file(s)`);
