/* ================================================================
   auth.js - Reusable Authentication & Hashing Module
   ================================================================ */

export const PBKDF2_ITERATIONS = 100000;

export const users = {
  sales: {
    "khaled.kayed": { salt: "2E6+H0sEPFv6ShwHXM+LDg==", hash: "J/RoMNTb6q6bFUZTDaV/F4sv5zx0k5FEQ70lGgCLuo8=" },
    "Dr.sofian.rajab": { salt: "fth+azqL4KKBg4BbyTr4ZA==", hash: "Svzz6h7rwXi/8Xo+x693kc27GC7+n3frQViV2VDtjc4=" },
    "bana.bana": { salt: "/iKM1uAek76EBG3d75mLHg==", hash: "zkJxhXPH2+4fm0QYw1usBkshM4NYCTyIzss4vU33bL4=" },
    "ahmad.khateeb": { salt: "WYqtB5deN/9g2mMzJdxDjQ==", hash: "UWQBqteBnEkiZSx7gGz0qGsTqulOct+bokXO7ZiY5S0=" },
  },
  finance: {
    "aseel.ibrahem": { salt: "zLyFob2xhvgaJF86GlB2Ng==", hash: "ZyIt5SzJSxk4DCNs7YBAcWST+bC6ZoADYg3Lnp9Tlng=" },
    "Dr.sofian.rajab": { salt: "GOrw5/duZMN4ic4K2KamUg==", hash: "CJAmrQ7eQeyH4nuXKa64rnTjgd5tDM87PPKVTnX9uaA=" },
    "bana.bana": { salt: "yi72vSfrTlaWRI3uapnS2w==", hash: "6dZyxuEPhkqobQGr/Jd8wEEo375lEDprifcVybbOh+o=" },
  },
  busdev: {
    "khaled.kayed": { salt: "VKHlIWBHRnKRGYeAA54djA==", hash: "LirAWyqgcc1pAoPd/UxAMxCrF7AbymioxRqPu+WNzZ0=" },
    "Dr.sofian.rajab": { salt: "QjnN5nEjm+cLbsiPEQ9EgA==", hash: "+Fy4RRq/zrFOdVEbwwqpcBBSnibrjC7dca0RS7KnHoY=" },
    "bana.bana": { salt: "wxX03Sm4oU0kP1/usGImcQ==", hash: "rGvNVMS6ypvGtBSGNBvs7kOJPLY52VSxiraElErguRc=" },
  },
};

/** Constant-time compare for derived key bytes (mitigates timing leaks on match). */
function timingSafeEqualUint8(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/**
 * Verify plaintext against stored salt + PBKDF2 hash.
 */
export async function verifyPasswordPBKDF2(plainPassword, saltB64, expectedHashB64) {
  if (!plainPassword || !saltB64 || !expectedHashB64) return false;
  if (!globalThis.crypto?.subtle) return false;
  try {
    const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(plainPassword),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: PBKDF2_ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );
    const derived = new Uint8Array(bits);
    const expected = Uint8Array.from(atob(expectedHashB64), c => c.charCodeAt(0));
    return timingSafeEqualUint8(derived, expected);
  } catch {
    return false;
  }
}