# Deno Hash Bench

Benchmarks for password hashing and verifying using different packages.

Trying to find what the fastest packages are for argon2 and bcrypt for hashing
and verifying passwords. In particular, I want to know what are the fastest
overall. But also waht are the fastest that use WASM because Deno Deploy does
not support FFI.

Ideally Deno's @std/crypto library would include an implementation of these
popular algorithms, [like Bun does](https://bun.sh/docs/api/hashing). For now
the best we've got is WASM or FFI.

See specific versions of libraries in `bench.ts`.

## Run the Benchmarks

``` console
deno bench -A bench.ts
```

## Results

``` text
    CPU | Apple M3
Runtime | Deno 2.1.4 (aarch64-apple-darwin)

file:///Users/brettchalupa/workspace/workbench/deno_hash_bench/bench.ts

benchmark                                            time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------------------------------------- ----------------------------- --------------------- --------------------------

group argon2
Hash and Verify - @felix/argon2 (Rust FFI)                   32.9 ms          30.4 ( 30.8 ms …  43.9 ms)  32.5 ms  43.9 ms  43.9 ms
Hash and Verify - @stdext/crypto > argon2 (WASM)             71.5 ms          14.0 ( 70.6 ms …  74.6 ms)  71.7 ms  74.6 ms  74.6 ms
Hash and Verify - @stdext/crypto > argon2i (WASM)            72.1 ms          13.9 ( 70.9 ms …  73.9 ms)  72.8 ms  73.9 ms  73.9 ms
Hash and Verify - @stdext/crypto > argon2id (WASM)           73.9 ms          13.5 ( 71.0 ms …  77.8 ms)  75.4 ms  77.8 ms  77.8 ms
Hash and Verify - @rabbit-company/argon2id (WASM)           416.3 ms           2.4 (413.3 ms … 422.9 ms) 415.4 ms 422.9 ms 422.9 ms
Hash and Verify - @ts-rex/argon2 (WASM)                      83.8 ms          11.9 ( 82.5 ms …  86.0 ms)  84.4 ms  86.0 ms  86.0 ms
Hash and Verify - npm:argon2 (C FFI)                         62.4 ms          16.0 ( 58.8 ms …  70.5 ms)  63.7 ms  70.5 ms  70.5 ms
Hash and Verify - npm:@node-rs/argon2 (Rust FFI)             23.6 ms          42.4 ( 22.5 ms …  27.0 ms)  23.6 ms  27.0 ms  27.0 ms

summary
  Hash and Verify - npm:@node-rs/argon2 (Rust FFI)
     1.40x faster than Hash and Verify - @felix/argon2 (Rust FFI)
     2.65x faster than Hash and Verify - npm:argon2 (C FFI)
     3.04x faster than Hash and Verify - @stdext/crypto > argon2 (WASM)
     3.06x faster than Hash and Verify - @stdext/crypto > argon2i (WASM)
     3.13x faster than Hash and Verify - @stdext/crypto > argon2id (WASM)
     3.56x faster than Hash and Verify - @ts-rex/argon2 (WASM)
    17.67x faster than Hash and Verify - @rabbit-company/argon2id (WASM)

group bcrypt
Hash and Verify - @felix/bcrypt (Rust FFI)                  368.8 ms           2.7 (366.7 ms … 370.8 ms) 370.4 ms 370.8 ms 370.8 ms
Hash and Verify - @ts-rex/bcrypt (WASM)                     444.9 ms           2.2 (438.1 ms … 449.7 ms) 446.8 ms 449.7 ms 449.7 ms
Check https://jsr.io/@da/bcrypt/1.0.1/src/worker.ts
Hash and Verify - @da/bcrypt (TypeScript)                   135.9 ms           7.4 (133.5 ms … 141.2 ms) 136.3 ms 141.2 ms 141.2 ms
Hash and Verify - @stdext/crypto > bcrypt (WASM)            503.9 ms           2.0 (494.8 ms … 546.0 ms) 497.5 ms 546.0 ms 546.0 ms

summary
  Hash and Verify - @da/bcrypt (TypeScript)
     2.71x faster than Hash and Verify - @felix/bcrypt (Rust FFI)
     3.27x faster than Hash and Verify - @ts-rex/bcrypt (WASM)
     3.71x faster than Hash and Verify - @stdext/crypto > bcrypt (WASM)
```

## Takeaways

### Argon2

For argon2, [@felix/argon2](https://jsr.io/@felix/argon2) and
[@node-rs/argon2](https://www.npmjs.com/package/@node-rs/argon2) are the fatest
by a pretty considerable margin.

But they both rely upon FFI, which isn't compatible with Deno Deploy.

For running on Deno Deploy, @stdext/crypto is the fastest, with @ts-rex/argon2
not far behind.

@rabbit-company/argon2id is the slowest by a lot.

### Bcrypt

For bcrypt, @da/bcrypt is the fastest, which is surprising since it's just
TypeScript. Unclear to me why it's so much faster than Rust FFI. Spooks me out
a little to be honest.

### What I'd Use

My current need is to hash and verify passwords for a simple application hosted
on Deno Deploy. I'd like to use the argon2 algorithm. Therefore, given my
needs, I'd use @stdext/crypto for hashing and verifying passwords. It's the
fastest WASM-based module and is, under the hood, the Rust crate compiled to
WASM.
