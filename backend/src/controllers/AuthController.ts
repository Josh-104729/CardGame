import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { PersonInfoService } from "../services/PersonInfoService";
import { T } from "../constants/texts";
import { secretOrKey } from "../constants/config";
import { INITIAL_BOUNTY } from "../constants/variables";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  ClearTokenRequest,
  ValidateTokenRequest,
  ApiResponse,
} from "../types";

export class AuthController {
  private personInfoService: PersonInfoService;

  constructor() {
    this.personInfoService = new PersonInfoService();
  }

  async login(req: Request<{}, LoginResponse, LoginRequest>, res: Response<LoginResponse>): Promise<void> {
    try {
      const { UserName, Password } = req.body;
      const result = await this.personInfoService.findByUsername(UserName);

      const myResult: LoginResponse = {
        variant: "",
        msg: "",
      };

      if (!result) {
        myResult.msg = T.NO_USER_FOUND;
        myResult.variant = "warning";
        res.send(myResult);
        return;
      }

      // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      // This handles backward compatibility with existing plain text passwords
      const isPasswordHashed = result.password.startsWith("$2a$") || 
                                result.password.startsWith("$2b$") || 
                                result.password.startsWith("$2y$");
      
      let passwordMatch = false;
      if (isPasswordHashed) {
        passwordMatch = await comparePassword(Password, result.password);
      } else {
        // Backward compatibility: compare plain text and then hash it for future use
        passwordMatch = Password === result.password;
        if (passwordMatch) {
          // Migrate plain text password to hashed password
          const hashedPassword = await hashPassword(Password);
          await this.personInfoService.update(result.username, { password: hashedPassword });
        }
      }

      if (!passwordMatch) {
        myResult.msg = T.USER_SIGNIN_INCORRECT_PASSWORD;
        myResult.variant = "warning";
        res.send(myResult);
        return;
      }

      if (parseInt(result.allowedbyadmin.toString()) !== 1) {
        myResult.msg = T.USER_SIGNIN_PERMISSION_NEEDED;
        myResult.variant = "info";
        res.send(myResult);
        return;
      }

      myResult.msg = T.USER_SIGNIN_SUCCESS;
      myResult.variant = "success";
      myResult.bounty = result.bounty;
      myResult.username = result.username;
      myResult.avatar = result.avatar_url;

      // JWT payload should not include password for security
      const payload = {
        name: UserName,
      };

      jwt.sign(
        payload,
        secretOrKey,
        { expiresIn: 10800 },
        async (err: Error | null, token: string | undefined) => {
          if (err) {
            console.error("JWT sign error:", err);
            res.status(500).send({ variant: "error", msg: "Server error" });
            return;
          }

          if (token) {
            myResult.token = "Bearer " + token;
            res.send(myResult);
          }
        }
      );
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).send({ variant: "error", msg: "Server error" });
    }
  }

  async register(req: Request<{}, RegisterResponse, RegisterRequest>, res: Response<RegisterResponse>): Promise<void> {
    try {
      const {
        FirstName,
        LastName,
        UserName,
        Password,
        BirthDay,
        Gender,
        AllowedByAdmin,
        Email,
        AvatarUrl,
      } = req.body;

      const existingUser = await this.personInfoService.findByUsername(UserName);

      const myResult: RegisterResponse = {
        variant: "",
        msg: "",
      };

      if (existingUser) {
        myResult.variant = "warning";
        myResult.msg = T.USER_SIGNUP_DUPLICATE;
        res.send(myResult);
        return;
      }

      const create_at = new Date().toISOString();
      // Hash password before storing in database
      const hashedPassword = await hashPassword(Password);
      await this.personInfoService.create({
        first_name: FirstName,
        last_name: LastName,
        username: UserName,
        password: hashedPassword,
        bounty: INITIAL_BOUNTY,
        birthdate: BirthDay,
        gender: Gender,
        allowedbyadmin: AllowedByAdmin,
        email: Email,
        avatar_url: AvatarUrl,
        create_at: create_at,
      });

      myResult.variant = "success";
      myResult.msg = T.USER_SIGNUP_SUCCESS;
      res.send(myResult);
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).send({ variant: "error", msg: "Server error" });
    }
  }

  async clearToken(req: Request<{}, ApiResponse, ClearTokenRequest>, res: Response<ApiResponse>): Promise<void> {
    try {
      // Tokens are now stateless JWTs, no database cleanup needed
      // This endpoint is kept for backward compatibility with frontend
      res.send({ status: 1 });
    } catch (err) {
      console.error("Clear token error:", err);
      res.send({ status: 0 });
    }
  }

  async validateToken(req: Request<{}, ApiResponse, ValidateTokenRequest>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { token } = req.body;
      
      // Remove "Bearer " prefix if present
      const cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
      
      // Verify JWT token
      jwt.verify(cleanToken, secretOrKey, async (err: Error | null, decoded: any) => {
        if (err) {
          res.send({ status: 0 });
          return;
        }

        // Get user info from database using username from token
        if (decoded && decoded.name) {
          const user = await this.personInfoService.findByUsername(decoded.name);
          if (!user) {
            res.send({ status: 0 });
            return;
          }

          // Return user info without sensitive data
          const userInfo = {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            bounty: user.bounty,
            avatar_url: user.avatar_url,
            email: user.email,
            birthdate: user.birthdate,
            gender: user.gender,
            allowedbyadmin: user.allowedbyadmin,
            create_at: user.create_at,
          };

          res.send({ status: 1, user: userInfo });
        } else {
          res.send({ status: 0 });
        }
      });
    } catch (err) {
      console.error("Validate token error:", err);
      res.send({ status: 0 });
    }
  }
}

