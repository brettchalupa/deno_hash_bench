import * as FelixArgon2 from "jsr:@felix/argon2@2.0.2";
import RabbitArgon2id from "jsr:@rabbit-company/argon2id@2.1.0";
import * as StdextHash from "jsr:@stdext/crypto@0.0.6/hash";
import * as TrexArgon2 from "jsr:@ts-rex/argon2@1.0.3";
import NodeArgon2 from "npm:argon2@0.41.1";
import NodeRsArgon2 from "npm:@node-rs/argon2@2.0.2";
import * as FelixBcrypt from "jsr:@felix/bcrypt@1.0.5";
import * as TrexBcrypt from "jsr:@ts-rex/bcrypt@1.0.3";
import * as DaBcrypt from "jsr:@da/bcrypt@1.0.1";

import { assert } from "jsr:@std/assert";

const password =
  "EZjm8ZkasFf2BxUzWWRyMZEqwnZu6MAjm6QHL9U79sz_@mUb29MxWnGkUMx9dc*g";

//////////////////////////////// argon2

Deno.bench(
  "Hash and Verify - @felix/argon2 (Rust FFI)",
  { group: "argon2" },
  async (b) => {
    b.start();
    const hash = await FelixArgon2.hash(password);
    const match = await FelixArgon2.verify(hash, password);
    b.end();
    assert(match);
  },
);

Deno.bench("Hash and Verify - @stdext/crypto > argon2 (WASM)", {
  group: "argon2",
}, (b) => {
  b.start();
  const hash = StdextHash.hash("argon2", password);
  const match = StdextHash.verify("argon2", password, hash);
  b.end();
  assert(match);
});

Deno.bench("Hash and Verify - @stdext/crypto > argon2i (WASM)", {
  group: "argon2",
}, (b) => {
  b.start();
  const hash = StdextHash.hash(
    { name: "argon2", algorithm: "argon2i" },
    password,
  );
  const match = StdextHash.verify("argon2", password, hash);
  b.end();
  assert(match);
});

Deno.bench("Hash and Verify - @stdext/crypto > argon2id (WASM)", {
  group: "argon2",
}, (b) => {
  b.start();
  const hash = StdextHash.hash(
    { name: "argon2", algorithm: "argon2id" },
    password,
  );
  const match = StdextHash.verify("argon2", password, hash);
  b.end();
  assert(match);
});

Deno.bench("Hash and Verify - @rabbit-company/argon2id (WASM)", {
  group: "argon2",
}, async (b) => {
  b.start();
  const hash = await RabbitArgon2id.hashEncoded(password);
  const match = await RabbitArgon2id.verify(hash, password);
  b.end();
  assert(match);
});

Deno.bench("Hash and Verify - @ts-rex/argon2 (WASM)", {
  group: "argon2",
}, (b) => {
  b.start();
  const hash = TrexArgon2.hash(password);
  const match = TrexArgon2.verify(password, hash);
  b.end();
  assert(match);
});

Deno.bench("Hash and Verify - npm:argon2 (C FFI)", {
  group: "argon2",
}, async (b) => {
  b.start();
  const hash = await NodeArgon2.hash(password);
  const match = await NodeArgon2.verify(hash, password);
  b.end();
  assert(match);
});

Deno.bench("Hash and Verify - npm:@node-rs/argon2 (Rust FFI)", {
  group: "argon2",
}, async (b) => {
  b.start();
  const hash = await NodeRsArgon2.hash(password);
  const match = await NodeRsArgon2.verify(hash, password);
  b.end();
  assert(match);
});

//////////////////////////////// bcrypt

Deno.bench("Hash and Verify - @felix/bcrypt (Rust FFI)", {
  group: "bcrypt",
}, async (b) => {
  b.start();
  const hash = await FelixBcrypt.hash(password);
  const match = await FelixBcrypt.verify(password, hash);
  b.end();
  assert(match);
});

Deno.bench("Hash and Verify - @ts-rex/bcrypt (WASM)", {
  group: "bcrypt",
}, (b) => {
  b.start();
  const hash = TrexBcrypt.hash(password);
  const match = TrexBcrypt.verify(password, hash);
  b.end();
  assert(match);
});

Deno.bench("Hash and Verify - @da/bcrypt (TypeScript)", {
  group: "bcrypt",
}, async (b) => {
  b.start();
  const hash = await DaBcrypt.hash(password);
  const match = await DaBcrypt.compare(password, hash);
  b.end();
  assert(match);
});

Deno.bench("Hash and Verify - @stdext/crypto > bcrypt (WASM)", {
  group: "bcrypt",
}, (b) => {
  b.start();
  const hash = StdextHash.hash("bcrypt", password);
  const match = StdextHash.verify("bcrypt", password, hash);
  b.end();
  assert(match);
});

// TODO:
// https://www.npmjs.com/package/bcrypt
// https://www.npmjs.com/package/bcryptjs
// https://www.npmjs.com/package/bcrypt-ts

//////////////////////////////// scrypt

// TODO:
// https://jsr.io/@stdext/crypto (WASM)
// https://jsr.io/@denorg/scrypt (WASM)
// https://www.npmjs.com/package/scrypt
// https://www.npmjs.com/package/scrypt-js
// https://www.npmjs.com/package/scrypt-async
// https://www.npmjs.com/package/scrypt.js
// https://www.npmjs.com/package/scryptsy
