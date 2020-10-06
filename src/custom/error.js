export class ErrorResponse extends Error {
 c = 0;

 constructor(c, message) {
  super(message);
  this.c = c;
 }
}
