import { Types } from 'mongoose';

import UserService from '@authorization/a1-user/user.service';
import { GetCurrentUserId } from '@decorator/get-current-user-id.decorator';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import AuthService from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import SignInDto from './dto/sign-in.dto';
import SignupDto from './dto/sign-up.dto';
import SignInLocalDto from './dto/signin-local.dto';
import SignInWithSocialDto from './dto/signin-with-social.dto';
import SignupLocalDto from './dto/sigup-local.dto';

@ApiTags('Auth')
@Controller()
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private logger: CustomLoggerService,
  ) {}

  /**
   * SignIn with social
   * @param body
   * @returns
   */
  @Post('signin-with-device')
  async signWithDeviceID(@Body('deviceID') deviceID: string) {
    if (!deviceID) throw new BadRequestException('Device ID not found.');

    return this.authService.signWithDeviceID(deviceID);
  }

  /**
   * SignIn with social
   * @param body
   * @returns
   */
  @Post('signin-with-social')
  async signInWithSocial(@Body() body: SignInWithSocialDto) {
    return this.authService.signInWithSocial(body);
  }

  /**
   *Sign in with account local
   * @param body
   * @returns
   */
  @Post('signin-local')
  async signInLocal(@Body() body: SignInLocalDto) {
    return this.authService.signInLocal(body);
  }

  /**
   * Sign up with account local
   * @param body
   * @returns
   */
  @Post('signup-local')
  async signupLocal(@Body() body: SignupLocalDto) {
    return this.authService.signupLocal(body);
  }

  /**
   *Sign in with account local
   * @param body
   * @returns
   */
  @Post('signin')
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  /**
   * Sign up with email and password
   * @param body
   * @returns
   */
  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  /**
   * Sign out
   * @param userId
   * @param deviceID
   * @returns
   */
  @Post('sign-out')
  async signout(
    @GetCurrentUserId() userId: Types.ObjectId,
    @Body('deviceID') deviceID: string,
  ) {
    // Remove deviceID and pop fcm token
    await this.userService.removeDeviceID(userId, deviceID);

    return { success: true };
  }

  /**
   * Refresh token
   * @param {refreshToken}
   * @returns
   */
  @Put('refresh-token')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.refreshToken({ refreshToken });
  }
}
