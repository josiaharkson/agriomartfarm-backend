import bcrypt from "bcryptjs";

export class Encrypt {
 static hashPw(pw) {
  return bcrypt.hashSync(pw, bcrypt.genSaltSync(14));
 }

 static compare(pw, hash) {
  return bcrypt.compareSync(pw, hash);
 }
}
