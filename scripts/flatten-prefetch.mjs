// Runs after `next build`.
// Next.js 16's static export writes link-prefetch files as folders
// (e.g. about/__next.about/__PAGE__.txt) while the browser requests flat names
// (about/__next.about.__PAGE__.txt). Static hosts like GitHub Pages then return 404
// for every prefetch. Copying each file to the flat name fixes that.
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const OUT = "out";
let copied = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(dir, full, name);
    else walk(full);
  }
}

// Copy every file inside pageDir/__next.x/... to pageDir/__next.x.<...>.txt
function flatten(pageDir, nestedRoot, prefix) {
  const stack = [[nestedRoot, prefix]];
  while (stack.length) {
    const [dir, flat] = stack.pop();
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      const flatName = `${flat}.${name}`;
      if (statSync(full).isDirectory()) stack.push([full, flatName]);
      else {
        const target = path.join(pageDir, flatName);
        if (!existsSync(target)) {
          copyFileSync(full, target);
          copied++;
        }
      }
    }
  }
}

if (existsSync(OUT)) {
  walk(OUT);
  console.log(`flatten-prefetch: copied ${copied} prefetch file(s)`);
}
