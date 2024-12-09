const crypto = require('crypto');

async function argon2Hash(password, salt = crypto.randomBytes(16)) {
    const iterations = 3; // Số vòng lặp
    const memoryCost = 32 * 1024; // Dung lượng bộ nhớ (32MB)
    const parallelism = 1; // Mức độ song song
    const hashLength = 32; // Độ dài kết quả băm

    let derivedKey = Buffer.from(password + salt.toString('hex'), 'utf8');
    for (let i = 0; i < iterations; i++) {
        derivedKey = crypto.pbkdf2Sync(derivedKey, salt, memoryCost, hashLength, 'sha256');
    }

    return {
        hash: derivedKey.toString('hex'),
        salt: salt.toString('hex')
    };
}

async function argon2Verify(storedHash, storedSalt, password) {
    const { hash } = await argon2Hash(password, Buffer.from(storedSalt, 'hex'));
    return hash === storedHash;
}

module.exports = { argon2Hash, argon2Verify };
