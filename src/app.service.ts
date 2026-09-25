import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  printHelloWorld(): string {
    return 'Hello World'
  }
}