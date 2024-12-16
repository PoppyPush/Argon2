// Hàm chuyển chuỗi thành mảng byte theo mã hóa UTF-8
function stringToBytes(str) {
    const utf8 = [];
    for (let i = 0; i < str.length; i++) {
        utf8.push(str.charCodeAt(i));
    }
    return utf8;
}

// Hàm chuyển mảng byte thành chuỗi Hex
function bytesToHex(bytes) {
    return bytes.map(byte => ('0' + byte.toString(16)).slice(-2)).join('');
}

// Hàm hash thủ công (Sử dụng SHA256 đơn giản(mô phỏng thôi nha aeae))
function simpleSha256(data) {
    // Chuyển dữ liệu sang mảng byte
    let bytes = stringToBytes(data);
    
    // Đơn giản hóa, dùng một thuật toán hash cơ bản (lặp lại XOR)
    let hash = new Array(32).fill(0);
    
    // Lặp lại các byte trong dữ liệu để mô phỏng hash
    for (let i = 0; i < bytes.length; i++) {
        for (let j = 0; j < hash.length; j++) {
            hash[j] = (hash[j] + bytes[i]) % 256;
        }
    }
    
    return hash;
}

// Hàm Argon2 Hash 
function argon2Hash(password, salt) {
    const iterations = 3; // Số vòng lặp (Iterations)
    const hashLength = 32; // Độ dài kết quả băm (32 byte)

    let derivedKey = stringToBytes(password + salt);

    // Lặp lại quá trình băm
    for (let i = 0; i < iterations; i++) {
        let hash = simpleSha256(bytesToHex(derivedKey)); // Băm chuỗi
        derivedKey = hash;
    }

    return {
        hash: bytesToHex(derivedKey), // Trả về kết quả băm
        salt: salt // Trả về salt dưới dạng hex
    };
}

// Hàm xác minh mật khẩu so với hash đã lưu
function argon2Verify(storedHash, storedSalt, password) {
    // Tính toán hash mới từ mật khẩu và salt
    const { hash } = argon2Hash(password, storedSalt);
    
    // So sánh hash mới với hash đã lưu
    return hash === storedHash;
}

// Khởi tạo
const salt = 'a_random_salt_value';
const password = 'my_secure_password';

// Băm mật khẩu
const { hash, salt: usedSalt } = argon2Hash(password, salt);
console.log('Hash:', hash);
console.log('Salt:', usedSalt);

// Kiểm tra xác minh mật khẩu
const isVerified = argon2Verify(hash, usedSalt, password);
console.log('Password Verified:', isVerified);

// Export các hàm
module.exports = { argon2Hash, argon2Verify };
